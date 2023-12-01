const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-this.addPlayerPage.ejs', {
            title: 'Welcome to Socka | Add a new player'
            , message: ''
        })
    },
    // Nos quedamos aquí. El próximo día continuamos
    addPlayer: (req, res) => {
        if (!req, file) {

            return res.status(400).send("No files were uploaded");
        }
        let message = ''
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadeFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '_' + fileExtension;

        let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";
        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    title: "Welcome to Socka | Add a new player",
                    message: ''
                });
            } else {
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif'){
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed." 
                    res.render('add-player.ejs',{
                        message,
                        title: "Welcome to Socka | Add a new player",
                    });
                    
                }
            }
        });
    },
    editPlayersPage: (req,res)=> {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id= '"+playerId + "' ";
        db.query (query, (err, result ) => {
            if (err) {
                return res.status (500).send (err);
            }
            res.render ('edit-players.ejs', {
                title: "Edit player",
                player: result [0],
                message: ''

            });

        });
         
    },
    editPlayer: (req,res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        // Nos hemos quedado por aquí
        let query = "UPDATE `player` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name +"', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId +"'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },

    deletePlayer: (req,res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELEC image from `players` Where id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';
        
        db.query(getImageQuery, (err,result) => {
            if (err){
                return res.status(500).send(err);
            }
            let image = result [0].image;
            fs.unlink (`public/assets/img/${image}`, (err) => {
                if (err){
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err,result)=>{
                    if (err){
                        return res.status(500).send (err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};