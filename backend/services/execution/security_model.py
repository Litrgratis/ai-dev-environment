import docker

class SecureCodeRunner:
    def __init__(self):
        self.docker_client = docker.from_env()
        self.resource_limits = {
            'memory': '512m',
            'cpu_quota': 50000,
            'timeout': 30,
            'network': 'none'
        }

    def create_secure_container(self, language):
        # Map language to docker image
        image_map = {
            'python': 'python:3.11-alpine',
            'javascript': 'node:20-alpine',
            'java': 'openjdk:21-jdk-alpine',
            'cpp': 'gcc:13.2.0'
        }
        image = image_map.get(language)
        if not image:
            raise ValueError(f"Unsupported language: {language}")
        container = self.docker_client.containers.run(
            image,
            command="sleep infinity",
            detach=True,
            mem_limit=self.resource_limits['memory'],
            cpu_quota=self.resource_limits['cpu_quota'],
            network_disabled=True
        )
        return container

    def run_with_limits(self, container, code):
        # Copy code into container and execute with timeout
        exec_cmd = None
        if 'python' in container.image.tags[0]:
            exec_cmd = ['python', '/tmp/code.py']
            filename = '/tmp/code.py'
        elif 'node' in container.image.tags[0]:
            exec_cmd = ['node', '/tmp/code.js']
            filename = '/tmp/code.js'
        elif 'openjdk' in container.image.tags[0]:
            exec_cmd = ['java', '/tmp/Code.java']
            filename = '/tmp/Code.java'
        elif 'gcc' in container.image.tags[0]:
            exec_cmd = ['g++', '/tmp/code.cpp', '-o', '/tmp/a.out']  # then run /tmp/a.out
            filename = '/tmp/code.cpp'
        else:
            raise ValueError("Unsupported container image")

        # Copy code file
        import io, tarfile
        tarstream = io.BytesIO()
        with tarfile.open(fileobj=tarstream, mode='w') as tar:
            file_data = code.encode()
            tarinfo = tarfile.TarInfo(name=filename.lstrip('/'))
            tarinfo.size = len(file_data)
            tar.addfile(tarinfo, io.BytesIO(file_data))
        tarstream.seek(0)
        container.put_archive('/tmp', tarstream)

        # For C++, compile then run
        if 'gcc' in container.image.tags[0]:
            compile_exec = container.exec_run(['g++', '/tmp/code.cpp', '-o', '/tmp/a.out'], demux=True)
            if compile_exec.exit_code != 0:
                return {'error': (compile_exec.output[1] or b'').decode()}
            exec_cmd = ['/tmp/a.out']

        # Run code with timeout
        try:
            exec_result = container.exec_run(exec_cmd, demux=True, stdin=False, tty=False, stream=False, timeout=self.resource_limits['timeout'])
            stdout = (exec_result.output[0] or b'').decode() if exec_result.output else ''
            stderr = (exec_result.output[1] or b'').decode() if exec_result.output else ''
            return {'stdout': stdout, 'stderr': stderr}
        except Exception as e:
            return {'error': str(e)}

    def cleanup_container(self, container):
        try:
            container.kill()
        except Exception:
            pass
        try:
            container.remove(force=True)
        except Exception:
            pass

    def execute_code(self, code, language):
        container = self.create_secure_container(language)
        result = self.run_with_limits(container, code)
        self.cleanup_container(container)
        return result
