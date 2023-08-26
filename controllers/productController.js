const Product = require('../models/Product')



exports.createProduct = (req, res, next) => {
    delete req.body._id;
    const product = new Product({
        ...req.body
    });
    product.save()
        .then(() => res.status(201).json({message : 'Objet produit est bien enregistré !', data : product}))
        .catch(err => {
            res.status(400).json({err});
        })
};

exports.findAllProducts = (req,res) => {
    Product.find()
        .then(allProducts => {
            res.status(200).json({message : 'vous avez afficher tous les produits', data : allProducts})
        })
        .catch(error => {
            const message = 'aucun produit existe';
            res.status(404).json({message, error})});
};

exports.modifyProduct = (req, res, next) => {
    const id = req.params.id; // Utilisez req.params.id ici
    Product.updateOne({ _id: id }, req.body) // Vous pouvez simplement passer req.body ici
        .then(_ => {
            const message = 'Le produit a été modifié avec succès';
            res.status(200).json({ message });
        })
        .catch(error => {
            const message = 'Erreur lors de la modification du produit';
            res.status(500).json({ message, error });
        });
}

exports.deleteOneProduct = (req,res,next) => {
    Product.deleteOne({_id : req.params.id})
        .then(_ => {res.status(200).json({message : 'l objet a ete bien supprimer'})})
        .catch(error => res.status(400).json({error : error}))
};

exports.findOneProduct = (req, res, next) => {
    Product.findById({_id : req.params.id})
        .then(product => res.status(200).json({product}))
        .catch(err => res.status(404).json({err}))
}
