const db = require('../db.js');

//METODO GET
function consultaPelicula(req,res,next){
    
    if(typeof(req.query.id) == "undefined"){ consulta = "SELECT * FROM peliculas"
    } else{ consulta = "SELECT * FROM peliculas WHERE id = ?" }

    db.query(
        consulta, [req.query.id],
        function(err, results, fields){
            if(err){
                res.json({Error: "Error en el servidor"})
            }
            if(results.length>0){
                res.json({resultado:results})
            } else{
                res.json({Error:"No se encontraron resultados"});
            }
        }
    )
}

//METODO POST
function insertarPelicula(req, res) {
    try
    {
        const {
        titulo,
        director,
        genero,
        anio,
        duracion,
        clasificacion,
        idioma,
        sinopsis,
        fecha_estreno
        } = req.body;

        if(!titulo || !director || !genero || !anio || !duracion || !clasificacion || !idioma || !sinopsis || !fecha_estreno)
        {
            return res.json({error: "Faltan datos"});
        }

        //consulta = `INSERT INTO peliculas (titulo, director, genero, anio, duracion, clasificacion, idioma, sinopsis, fecha_estreno) VALUES (\"${titulo}\", \"${director}\", \"${genero}\", ${anio}, ${duracion}, \"${clasificacion}\", \"${idioma}\", \"${sinopsis}\", \"${fecha_estreno}\")`

        const consulta = `INSERT INTO peliculas 
        (titulo, director, genero, anio, duracion, clasificacion, idioma, sinopsis, fecha_estreno) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const parametros = [
        titulo,
        director,
        genero,
        anio,
        duracion,
        clasificacion,
        idioma,
        sinopsis,
        fecha_estreno
    ];

    db.query(consulta, parametros, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al insertar en la base de datos" });
        }
        res.status(201).json({ mensaje: "Película insertada correctamente", id: result.insertId });
    });
    }
    catch(error)
    {
        res.json({error: "Error en el server"});
    }
};

//METODO DELETE
function eliminarPelicula(req, res)
{
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Falta el parámetro 'id' en la URL" });
    }

    consulta = "DELETE FROM peliculas WHERE ID = ?";

    db.query(consulta, [id], function(err, results){
        if(err){
            res.json({Error: "Error en el servidor"})
        }
        if(results.affectedRows>0){
            res.status(200).json({Eliminacion: "Se elimino la pelicula correctamente!"})
        } else{
            res.status(404).json({Error:"No se encontro la pelicula a eliminar"});
        }
    }
    )
}

//METODO PUT
function modificarPelicula(req, res)
{
    try
    {
        const {
        titulo,
        director,
        genero,
        anio,
        duracion,
        clasificacion,
        idioma,
        sinopsis,
        fecha_estreno
        } = req.body;

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Falta el parámetro 'id' en la URL" });
        }


        if(!titulo || !director || !genero || !anio || !duracion || !clasificacion || !idioma || !sinopsis || !fecha_estreno)
        {
            return res.json({error: "Faltan datos"});
        }

        const consulta = `UPDATE peliculas SET 
        titulo = ?, 
        director = ?, 
        genero = ?, 
        anio = ?, 
        duracion = ?, 
        clasificacion = ?, 
        idioma = ?, 
        sinopsis = ?, 
        fecha_estreno = ? 
        WHERE id = ?`;

        const parametros = [
        titulo,
        director,
        genero,
        anio,
        duracion,
        clasificacion,
        idioma,
        sinopsis,
        fecha_estreno,
        id
    ];

    db.query(consulta, parametros, (err, result) => {
        if (err) {
            console.error("Error en la modificación:", err);
            return res.status(500).json({ error: "Error al modificar la película" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró la película para modificar" });
        }

        res.status(200).json({ mensaje: "Película modificada correctamente" });
    });
        
    }
    catch(error)
    {
        res.json({error: "Error en el server"});
    }
}

//METODO PATCH
function actualizarPelicula(req, res)
{
    try
    {
        const {
        titulo,
        director,
        genero,
        anio,
        duracion,
        clasificacion,
        idioma,
        sinopsis,
        fecha_estreno
        } = req.body;

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Falta el parámetro 'id' en la URL" });
        }

        if(!titulo && !director && !genero && !anio && !duracion && !clasificacion && !idioma && !sinopsis && !fecha_estreno)
        {
            return res.json({error: "Debe enviar por lo menos un campo"});
        }

        consulta = "UPDATE peliculas SET "
        const parametros = []; 
        
        if(titulo)
        {
            consulta += `titulo=?, `
            parametros.push(titulo);
        }

        if(director)
        {
            consulta += `director=?, `
            parametros.push(director);
        }

        if(genero)
        {
            consulta += `genero=?, `
            parametros.push(genero);
        }

        if(anio)
        {
            consulta += `anio=?, `
            parametros.push(anio);
        }

        if(duracion)
        {
            consulta += `duracion=?, `
            parametros.push(duracion);
        }

        if(clasificacion)
        {
            consulta += `clasificacion=?, `
            parametros.push(clasificacion);
        }

        if(idioma)
        {
            consulta += `idioma=?, `
            parametros.push(idioma);
        }

        if(sinopsis)
        {
            consulta += `sinopsis=?, `
            parametros.push(sinopsis);
        }

        if(fecha_estreno)
        {
            consulta += `fecha_estreno=?, `
            parametros.push(fecha_estreno);
        }

        parametros.push(id);
        consulta = consulta.substring(0, (consulta.length - 2));
        consulta += " WHERE Id = ?";

        db.query(consulta, parametros, (err, result) => {
            if (err) {
                console.error("Error en actualización parcial:", err);
                return res.status(500).json({ error: "Error al actualizar la película" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "No se encontró la película para actualizar" });
            }

            res.status(200).json({ mensaje: "Película actualizada correctamente" });
        });
    }
    catch(error)
    {
        res.json({error: "Error en el server"});
    }
}

module.exports.consultaPelicula=consultaPelicula; 
module.exports.insertarPelicula=insertarPelicula;
module.exports.eliminarPelicula=eliminarPelicula;
module.exports.modificarPelicula=modificarPelicula;
module.exports.actualizarPelicula=actualizarPelicula;