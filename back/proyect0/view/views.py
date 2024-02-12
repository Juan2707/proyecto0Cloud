import datetime
from sqlite3 import IntegrityError
from flask_restful import Resource
from ..model import db, Usuario, UsuarioSchema, Categoria, CategoriaSchema, Tarea, TareaSchema, TokenBlocklist
from flask import request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
import os

tarea_schema = TareaSchema()
usuario_schema = UsuarioSchema()
categoria_schema = CategoriaSchema()

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        try:
            db.session.add(TokenBlocklist(jti=jti))
            db.session.commit()
            return jsonify({"msg": "Sesión cerrada exitosamente."}), 200
        except Exception as e:
            return jsonify({"msg": "Error al cerrar sesión"}), 500

#Formato json post tarea
 #{
 # "texto": "Mi nueva tarea",
 # "fecha_creacion": "2023-01-30T14:00:00",
 # "fecha_finalizacion": "2023-02-15T14:00:00",
 # "estado": "SIN_EMPEZAR",
 # "categoria_id": 1
#}
                

class VistaTareasUsuario(Resource):
    @jwt_required()
    def post(self, id_usuario):
        try:
            nueva_tarea = Tarea(
                texto=request.json["texto"],
                fecha_creacion=datetime.datetime.fromisoformat(request.json["fecha_creacion"]),
                fecha_finalizacion=datetime.datetime.fromisoformat(request.json["fecha_finalizacion"]),
                estado=request.json["estado"]
            )
            
            categoria_id = request.json.get("categoria_id")
            if categoria_id:
                categoria = Categoria.query.get(categoria_id)
                if categoria:
                    nueva_tarea.categoria = categoria.id
                else:
                    return jsonify({"mensaje": "Categoría no encontrada"}), 404
            
            usuario = Usuario.query.get_or_404(id_usuario)
            usuario.tareas.append(nueva_tarea)
            db.session.add(nueva_tarea)
            db.session.commit()
            
            return tarea_schema.dump(nueva_tarea), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'mensaje': 'El usuario ya tiene esa tarea'}), 409
    
    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return [tarea_schema.dump(tarea) for tarea in usuario.tareas]

class VistaTareaUsuario(Resource):

    @jwt_required()
    def put(self, id_usuario, id_tarea):
        usuario = Usuario.query.get_or_404(id_usuario)
        for tarea in usuario.tareas:
            if tarea.id==id_tarea:
                tarea2 = Tarea.query.get_or_404(id_tarea)
                tarea2.texto = request.json.get('texto',tarea2.texto)
                tarea2.fecha_creacion = datetime.datetime.fromisoformat(request.json.get('fecha_creacion',tarea2.fecha_creacion))
                tarea2.fecha_finalizacion = datetime.datetime.fromisoformat(request.json.get('fecha_finalizacion',tarea2.fecha_finalizacion))
                tarea2.estado = request.json.get('estado',tarea2.estado)
                db.session.commit()
                return tarea_schema.dump(tarea2)
        return {'Message':"No hay tarea asociada"}
    
    @jwt_required()
    def delete(self, id_usuario, id_tarea):
        usuario = Usuario.query.get_or_404(id_usuario)
        for tarea in usuario.tareas:
            if tarea.id==id_tarea:
                tarea2 = Tarea.query.get_or_404(id_tarea)
                db.session.delete(tarea2)
                db.session.commit()
                return 'Operacion exitosa', 204
        return {'Message':"No hay tarea asociada"}
    
    @jwt_required()
    def get(self, id_usuario, id_tarea):
        usuario = Usuario.query.get_or_404(id_usuario)
        for tarea in usuario.tareas:
            if tarea.id==id_tarea:
                return tarea_schema.dump(Tarea.query.get_or_404(id_tarea))
                
        return {'Message':"No hay tarea asociada"}


class VistaCategoria(Resource):

    def get(self, id_categoria):
        return categoria_schema.dump(Categoria.query.get_or_404(id_categoria))
    
    def put(self, id_categoria):
        categoria= Categoria.query.get_or_404(id_categoria)
        categoria.nombre = request.json.get('nombre',categoria.nombre)
        categoria.descripcion = request.json.get('descripcion',categoria.descripcion)
        db.session.commit()
        return categoria_schema.dump(categoria)

    def delete(self, id_categoria):
        categoria = Categoria.query.get_or_404(id_categoria)
        db.session.delete(categoria)
        db.session.commit()
        return 'Operacion exitosa', 204

class VistaCategorias(Resource):

    def get(self):
        return [categoria_schema.dump(categoria) for categoria in Categoria.query.all()]
    
    def post(self):
        nueva_categoria = Categoria(nombre=request.json['nombre'],\
                                    descripcion=request.json['descripcion'])
        db.session.add(nueva_categoria)
        db.session.commit()
        return categoria_schema.dump(nueva_categoria)


    
class VistaLogIn(Resource):
    def post(self):
            u_nombre = request.json["nombre"]
            u_contrasena = request.json["contrasena"]
            usuario = Usuario.query.filter_by(nombre=u_nombre, contrasena = u_contrasena,).all()
            u_id = usuario[0].id
            if usuario:
                token_acceso = create_access_token(identity=request.json['nombre'])
                return {'mensaje':'Inicio de sesión exitoso','token':token_acceso,"id":u_id}
            else:
                return {'mensaje':'Nombre de usuario o contraseña incorrectos','token':'Null',"id":0}


class VistaSignIn(Resource):
    
    def post(self):
        # Acceder a los datos del formulario
        nombre = request.form['nombre']
        contrasena = request.form['contrasena']
        
        # Tratar de obtener el archivo de imagen del formulario
        imagen = request.files.get('imagen')

        # Asignar una imagen por defecto si no se subió una
        if imagen and allowed_file(imagen.filename):
            filename = secure_filename(imagen.filename)
            ruta_guardado = os.path.join('', filename)
            imagen.save(ruta_guardado)
            direccionImagen = ruta_guardado  # Usar la ruta de guardado como la dirección de la imagen
        else:
            direccionImagen = '/imagen_por_defecto.jpg'  # Ruta de la imagen por defecto

        # Crear el nuevo usuario con los datos recibidos
        nuevo_usuario = Usuario(nombre=nombre, contrasena=contrasena, direccionImagen=direccionImagen)
        
        # Crear el token de acceso
        token_de_acceso = create_access_token(identity=nombre)
        
        # Guardar el nuevo usuario en la base de datos
        db.session.add(nuevo_usuario)
        db.session.commit()
        usuario = Usuario.query.filter_by(nombre=nombre, contrasena = contrasena,).all()
        u_id = usuario[0].id

        return {'mensaje': 'usuario creado', 'token': token_de_acceso,"id":u_id}
    
    @jwt_required()
    def put(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.nombre = request.json.get("nombre", usuario.nombre)
        usuario.contrasena = request.json.get("contrasena", usuario.contrasena)
        imagen = request.files.get('imagen')
        if imagen and allowed_file(imagen.filename):
            filename = secure_filename(imagen.filename)
            ruta_guardado = os.path.join('ruta_donde_guardar_imagenes', filename)
            imagen.save(ruta_guardado)
            usuario.direccionImagen = ruta_guardado  # Actualizar la dirección de la imagen
        db.session.commit()
        return usuario_schema.dump(usuario)
    
    @jwt_required()
    def delete(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        db.session.delete(usuario)
        db.session.commit()
        return '',204
    


