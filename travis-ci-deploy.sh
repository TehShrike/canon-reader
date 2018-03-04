sudo chown -R $(whoami) /usr/local/bin
curl -sf https://up.apex.sh/install | sh
up upgrade
up --format=plain deploy production
