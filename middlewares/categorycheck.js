exports.checkId = async (req, res, next) => {
    const id = req.params.id;
    console.log("data = ", id);
    if (!id || id === ' ') {
        return res.status(200).json({
            message: "Category is required"
        })
    } else {
        next();
    }

}