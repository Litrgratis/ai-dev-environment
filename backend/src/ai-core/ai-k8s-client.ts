import k8s = require('@kubernetes/client-node');
export const k8sApi = new k8s.KubeConfig();
k8sApi.loadFromDefault();
export const coreV1Api = k8sApi.makeApiClient(k8s.CoreV1Api);
// Example: coreV1Api.listPodForAllNamespaces().then(...)
