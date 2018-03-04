echo "sudo chown -R $(whoami) /usr/local/bin:" && sudo chown -R $(whoami) /usr/local/bin \
&& echo "curl -sf https://up.apex.sh/install | sh:" && curl -sf https://up.apex.sh/install | sh \
&& echo "up upgrade:" && up upgrade \
&& echo "up --format=plain deploy $1:" && up --format=plain deploy $1
