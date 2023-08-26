const express = require("express");
const router = express();

router.get("/", (req ,res) => {
    res.render('../views/events/index.ejs')
})

module.exports = router;