import enum
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

#Aqui tendre que cambiar inicialmente la BD
db = SQLAlchemy()

categorias_tareas = db.Table('categoria_tarea',\
                             db.Column('categoria_id',db.Integer, db.ForeignKey('categoria.id'), primary_key=True),\
                                db.Column('tarea_id',db.Integer, db.ForeignKey('tarea.id'), primary_key=True))
class Estado(enum.Enum):
    SIN_EMPEZAR=1
    EMPEZADA=2
    FINALIZADA=3 

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(128))
    contrasena = db.Column(db.String(128))
    direccionImagen = db.Column(db.String(128))
    tareas = db.relationship('Tarea', cascade='all, delete, delete-orphan')

class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(128))
    descripcion = db.Column(db.String(128))

class Tarea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(128))
    fecha_creacion = db.Column(db.DateTime, default = datetime.utcnow)
    fecha_finalizacion = db.Column(db.DateTime, default= datetime.utcnow)
    estado = db.Column(db.Enum(Estado))
    categoria = db.Column(db.Integer, db.ForeignKey('categoria.id'))
    __table_args__ = (db.UniqueConstraint('categoria','texto',name='tareas_diferentes'),db.UniqueConstraint('usuario','texto',name='tareas_diferentes2'))
    usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))

class EnumADiccioanrio(fields.Field):
    def _serialize(self, value, attr, obk, **kwargs):
        if value is None:
            return None
        return {'llave':value.name,'valor':value.value}
    
class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True

class CategoriaSchema(SQLAlchemyAutoSchema):
    class Meta: 
        model = Categoria
        include_relationships = True
        load_instance = True

class TareaSchema(SQLAlchemyAutoSchema):
    estado = EnumADiccioanrio(attribute=('estado'))
    class Meta:
        model = Tarea
        include_relationships = True
        load_instance = True
