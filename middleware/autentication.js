const autenticacion = (req, res, next) => {
	req.user = {
		fullName: "Angel Nicolas",
		isAdmin: true,
	}
	next()
}

const autorizacion = (req, res, next) => {
	if (req.user.isAdmin) next();
	else res.status(403).send("No tienes permisos de el Administrador");
};

module.exports = {autenticacion, autorizacion}