from proyect0 import create_app
from flask_restful import Api
from flask_jwt_extended import JWTManager
from .proyect0.model import db, TokenBlocklist, Categoria
from .proyect0.view import VistaCategoria, VistaCategorias, VistaLogIn, VistaSignIn, VistaTareasUsuario, VistaTareaUsuario
from flask_cors import CORS

app = create_app('default')
app_context = app.app_context()
app_context.push()

db.init_app(app)
db.create_all()
categoria = Categoria(nombre="Standar",descripcion="Categoria standar")
db.session.add(categoria)
db.session.commit()

cors = CORS(app)

api = Api(app)
api.add_resource(VistaTareasUsuario, '/usuario/<int:id_usuario>/tareas')
api.add_resource(VistaTareaUsuario, '/usuario/<int:id_usuario>/tareas/<int:id_tarea>')
api.add_resource(VistaCategoria,'/categorias/<int:id_categoria>')
api.add_resource(VistaCategorias,'/categorias')
api.add_resource(VistaLogIn,'/usuarios/iniciar-sesion')
api.add_resource(VistaSignIn,'/usuarios')

jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def verificar_si_token_en_lista_de_bloqueo(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None