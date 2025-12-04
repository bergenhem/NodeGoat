// routes/vuln-mixin.js
const express = require('express');
const router = express.Router();

// IMPORTANT: this is the *transitive* vulnerable lib
const mixin = require('mixin-deep');

router.post('/mixin-deep-demo', express.json(), (req, res) => {
  try {
    const userPayload = req.body; // attacker-controlled object

    // Vulnerable use: we blindly deep-merge user object into a target
    mixin({}, userPayload);

    // If prototype was polluted, this property will suddenly appear on all objects
    const polluted = ({}).polluted === true;

    res.json({
      polluted,
      message: polluted
        ? 'Prototype successfully polluted via mixin-deep'
        : 'Not polluted (maybe patched version?)'
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'bad payload', details: err.message });
  }
});

module.exports = router;