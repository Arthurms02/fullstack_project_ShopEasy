# Projeto_WEB1_API-ShopEasy

## Tecnologias Utilizadas
---
* python
* Django REST Framework
* PostgresSQL
* JWT Authentication
* Swagger

## Sobre Autenticação
---
Para obter o token no Postman faça uma requesição POST para
127.0.0.1:8000/api/token/
com o BODY.
* POST 127.0.0.1:8000/api/token
```bash
{
    "username": "seu_usuario";
    "password": "sua_senha"
}
```
# Como usar 
## Clone o Projeto
---
```bash
git clone https://github.com/Arthurms02/Projeto_WEB1_API-ShopEasy.git
```
### Crie uma venv
---
```bash
python -m venv venv
venv\Scripts\activate.bat #Windowns
source venv/bin/activate #Linux/Mac
```
## Dentro da sua venv baixe as dependêcias do projeto
---
```bash
pip install -r requirements.txt
```
## Modifique o settings para colocar o seu banco
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': Nome do seu banco,
        'USER': Seu Usuario,
        'PASSWORD': Sua Senha,
        'HOST': Seu Host,
        'PORT': Porta que esta rodando seu banco,
    }
}
```

## Adicione ao seu banco dados iniciais
```bash
pyhton manage.py loaddata ./fixture/initial_data.json
```
## Adicione as migraçoes
```python
python manage.py makemigrations
python manage.py migrate
```
## Crie um super usuário
---
```bash
python manage.py createsuperuser
```
## Inicie o projeto com o comando
---
```bash
python manage.py runserver
```
