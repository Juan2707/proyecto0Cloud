from flask import Flask

def create_app(config_name):
    app = Flask(__name__)
    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=3000)

    app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///tareas_app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['JWT_SECRET_KEY']= 'MISO-2024-1'

    app.config['PROPAGATE_EXCEPTIONS']=True
    return app