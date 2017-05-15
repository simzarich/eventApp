var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var email_match = [/^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$/,'coloca un email valido'];
var posibles_valores = ['M', 'F'];
var password_validation ={
	validator:function(p){
		return this.password_confirmation == p;
	},
	message:'las constraseñas no son iguales'
};
var admin_schema = new Schema({
	name_admin: String,
  	password_admin: {type: String,minlength:[4,'el password es muy corto'], validate:password_validation},
  	age_admin:{type:Number,min:[5, 'la edad no puede ser menor a 5'],max:[100,'la edad no puede ser mayor a 100]']},
  	email_admin: {type:String, require:'el correo es obligatorio',match: email_match},
  	date_of_birth_admin: Date,
  	sex:{type:String,enum:{ values:posibles_valores, message:'Opcion no valida'}}

});

admin_schema.virtual('password_confirmation').get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});

var Admin = mongoose.model('Admin',admin_schema);
module.exports.Admin = Admin;