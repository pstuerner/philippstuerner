## Source code for my website

### Background
The website consists of several services that are deployed using Docker containers and a common docker-compose. The following services are implemented so far:
1. frontend: as the name says, all the HTML, CSS, JavaScript and D3 required for the navigation and visuals.
2. api: the website's backend, url routing, based on FastAPI
3. mongojs: a NodeJS backend to that allows me to connect to a local MongoDB instance on my Raspberry Pi
4. traefik: mainly used for https rerouting and wildcard letsencrypt certificates

### D3.js code
You can find most of the D3.js code for the visuals in [services/frontend/static/js](https://github.com/pstuerner/philippstuerner/tree/master/services/frontend/static/js).

### FastAPI web app
You can find the source code for the actual web application and the corresponding CORS middleware in [services/api/app/main.py](https://github.com/pstuerner/philippstuerner/blob/master/services/api/app/main.py).

### Traefik setup for https rerouting and wildcard certificates
You can find a working traefik config for https rerouting and wildcard letsencrypt certificates in the [docker-compose.yaml](https://github.com/pstuerner/philippstuerner/blob/master/docker-compose.yaml). Note: [philippstuerner.com](https://philippstuerner.com) is hosted on a DigitalOcean droplet, which is why the traefik config's wildcard setup refers to a DigitalOcean authentication token. Simply put your auth token in a file called traefik.env in [services/traefik](https://github.com/pstuerner/philippstuerner/tree/master/services/traefik). The file is not in the repo since I want to avoid personal credentials.
