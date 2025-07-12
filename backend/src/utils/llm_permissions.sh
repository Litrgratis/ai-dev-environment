#!/bin/bash
# Tworzenie użytkownika o ograniczonych prawach dla LLM
useradd -m -s /usr/sbin/nologin llm_user
# Ustawienie AppArmor/SELinux (przykład AppArmor)
# echo "/usr/bin/python3 DENY" > /etc/apparmor.d/llm_profile
# apparmor_parser -r /etc/apparmor.d/llm_profile
