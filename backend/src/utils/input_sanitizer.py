def sanitize_input(user_input: str) -> str:
    disallowed_patterns = ["os.system", "subprocess", "eval", "exec"]
    for pattern in disallowed_patterns:
        if pattern in user_input:
            raise ValueError("Niedozwolone wyrażenie w wejściu.")
    if len(user_input) > 2048:
        raise ValueError("Wejście zbyt długie.")
    return user_input
