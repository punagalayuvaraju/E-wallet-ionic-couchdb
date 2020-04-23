const nodemailer = require('nodemailer');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var nano = require('nano')('http://admin:admin@127.0.0.1:5984');
var session = require('express-session');
var QRCode = require('qrcode')
var rn = require('random-number');
const cors = require('cors');
var passport1 = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//==========access logs=============
const perf = require('execution-time')(console.log);
const logger = require('morgan');
var fs = require('fs');
var util = require('util');
var request = require('request');
perf.start();
//=============================

logger.token('date', function () {
    return new Date().toString()
})

var moment = require('moment');
console.log(moment().format('ddd, MMM D, YYYY hh:mm:ss A'))


var database;
const originurl = "http://localhost:8100"

//======================
var app = express(),
    server = require('http').createServer(app);
io = require('socket.io')(server);
//================================
nano.db.create('bcgtwallet', function (err, body) {

    database = nano.db.use('bcgtwallet');

    database.insert(
        {
            "views":
            {
                "data": {
                    "map": "function (doc) {\n  if(doc.type==\"user\")\n  emit(doc._id, {email:doc.email,ledger:doc.ledger,mobilenum:doc.mobilenumber,status:doc.status});\n}"
                }

            }
        }, '_design/verify', function (error, response) {
            if (!error) {
                console.log("+++View Created=====");
            }
            else {
                console.log("failed" + error)
            }
        });
    //dynamic view for validation of mobilenumber
    database.insert(
        {
            "views":
            {
                "mobileverification": {
                    "map": "function(doc)\n{\n  if(doc.type == \"user\")\n    emit(doc._id,{id:doc.id,mobilenumber:doc.mobilenumber,ledger:doc.ledger,status:doc.status,name:doc.name,walletamount:doc.walletamount,email:doc.email,rev:doc._rev}); }"
                }
            }
        }, '_design/addbeneficiary', function (error, response) {
            if (!error) {
                console.log("+++View Created=====");
            }
            else {
                console.log("failed" + error)
            }
        });
    //=========================================================
    //view benficiry
    database.insert(
        {
            "views":
            {
                "beneficiary": {
                    "map": "function(doc)\n{\n  if(doc.type == \"beneficiary\")\n    emit(doc._id,{id:doc._id,name:doc.name,ledger:doc.ledger,mobileno:doc.mobileno,mobilenumber:doc.mobilenumber,rev:doc._rev}); }"
                },
                "getbeneficiarybysessid": {
                    "map": "function(doc)\n{\n  if(doc.type == \"beneficiary\")\n    emit(doc.mobilenumber,{id:doc._id,name:doc.name,ledger:doc.ledger,mobileno:doc.mobileno,mobilenumber:doc.mobilenumber,rev:doc._rev}); }"
                }
            }
        }, '_design/view', function (error, response) {
            if (!error) {
                console.log("+++View Created=====");
            } else {
                console.log("failed" + error)
            }
        });
    //===========================================
    database.insert(
        {
            "views":
            {
                "usernotifications": {
                    "map": "function(doc) \n{\n  if(doc.type == \"moneyrequest\"||doc.type==\"sending\")\n  emit(doc._id,{to:doc.to,toname:doc.toname,type:doc.type,from:doc.from,type:doc.type,In:doc.In,id:doc.id,comment:doc.comment,rev:doc._rev,isnotified:doc.isnotified,timestamp:doc.timestamp,fromname:doc.fromname,requesternickname:doc.requesternickname,trans_status:doc.trans_status,sender_curr_bal:doc.sender_curr_bal});} "
                }
            }
        }, '_design/notifications', function (error, response) {
            if (!error) {
                console.log("+++View Created=====");
            }
            else {
                console.log("failed" + error)
            }
        });
    //================================
    //=================================
    // transaction history
    database.insert(
        {
            "views": {
                "credit_history": {
                    "map": "function (doc) {\n  if( doc.type==\"self\"){\n  emit(doc.to, {\n    id:doc.id,\n  from:doc.from,to:doc.to,\n  fromname:doc.fromname,\n  toname:doc.toname,\n  timestamp:doc.timestamp,\n  transferamount:doc.transferamount,\n  trans_status:doc.trans_status,\n  to:doc.to,\n    In:doc.In,\n    type:doc.type,\n  walletbal:doc.rcvr_curr_bal});\n}\n\nelse if(doc.trans_status==\"success\"&&doc.type==\"sending\"){\n    emit(doc.to, {\n      id:doc.id,\n    from:doc.from,\n    to:doc.to,\n    toname:doc.toname,\n    timestamp:doc.timestamp,\n    isnotified:doc.isnotified,\n    transferamount:doc.transferamount,\n    trans_status:doc.trans_status,\n    walletbal:doc.rcvr_curr_bal,\n    In:doc.In,\n     type:doc.type,\n    fromname:doc.fromname});\n}\n\nelse if(doc.type==\"sending\"){\n    emit(doc.to, {\n      id:doc.id,\n    to:doc.to,\n    toname:doc.toname,\n     timestamp:doc.timestamp,\n    isnotified:doc.isnotified,\n     trans_status:doc.trans_status,\n  from:doc.from,\n    In:doc.In,\n     walletbal:doc.rcvr_curr_bal,\n    type:doc.type,\n    fromname:doc.fromname});\n}\nelse if(doc.type==\"moneyrequest\"){\n    emit(doc.fromtemp, {\n      id:doc.id,\n    to:doc.to,\n    toname:doc.toname,\n     timestamp:doc.timestamp,\n    isnotified:doc.isnotified,\n     trans_status:doc.trans_status,\n  from:doc.from,\n    In:doc.In,\n     walletbal:doc.sender_curr_bal,\n    type:doc.type,\n    fromname:doc.fromname});\n}\n  }"
                },
                "debit_history": {
                    "map": "function (doc) {\n  if( doc.type==\"W2W\" ){\n  emit(doc.from, {id:doc.id,\n  fromname:doc.fromname,\n  from:doc.from,\n  to:doc.to,\n  toname:doc.tonickname,\n  timestamp:doc.timestamp,\n  isnotified:doc.isnotified,\n  transferamount:doc.transferamount,\n  trans_status:doc.trans_status,\n  out:doc.out,\n   type:doc.type,\n  walletbal:doc.sender_curr_bal});\n}\nelse if( doc.type==\"sending\" ){\n  emit(doc.from, {id:doc.id,\n  fromname:doc.fromname,\n  from:doc.from,\n  to:doc.to,\n  toname:doc.toname,\n  timestamp:doc.timestamp,\n  isnotified:doc.isnotified,\n  transferamount:doc.transferamount,\n  trans_status:doc.trans_status,\n  out:doc.out,\n   type:doc.type,\n  walletbal:doc.sender_curr_bal});\n}\nelse if( doc.type==\"moneyrequest\" ){\n  emit(doc.totemp, {id:doc.id,\n  fromname:doc.fromname,\n  from:doc.from,\n  to:doc.to,\n  toname:doc.toname,\n  timestamp:doc.timestamp,\n  isnotified:doc.isnotified,\n  transferamount:doc.transferamount,\n  trans_status:doc.trans_status,\n  out:doc.out,\n   type:doc.type,\n  walletbal:doc.rcvr_curr_bal});\n}\n}"
                }
            }
        }, '_design/history', function (error, response) {
            if (!error) {
                console.log("+++++View Created+++++");
            }
            else {
                console.log("failed" + error)
            }
        });



});




var card = nano.db.use("cardvalidation");

card.insert(
    {
        "views":
        {
            "new-view": {
                "map": "function (doc) {\n   if(doc.type == \"debitcard\" ||doc.type == \"creditcard\" ){\n    emit(doc._id,{id:doc.id,cardnumber:doc.cardnumber,amount:doc.amount,name:doc.name,rev:doc._rev,cvv:doc.cvv,mm:doc.mm,yy:doc.yy}); }\n}"
            }
        }
    }, '_design/card', function (error, response) {
        if (!error) {
            console.log("+++View Created=====");
        }
        else {
            console.log("failed" + error)
        }
    })
app.use(cors({
    origin: [
        originurl
    ], credentials: true
}));
//=======================================================
//encription password
var key = "secretkey";
var crypto = require("crypto")

function encrypt(key, data) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}


function decrypt(key, data) {
    var decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}



//=============logs===================
app.use(logger('dev'));
var log_stdout = process.stdout;
console.log = function (d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};
const log_file = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
);

app.use(logger('combined', { stream: log_file }))
//=====================================

//sockets code
let users = new Set();
var user
console.log("socket is created...")




io.on('connection', socket => {
    console.log(`Socket ${socket.id} added`);
    socket.on('clientdata', data => {
        user = { "sockid": socket, "mobilenum": data }
        users.add(user)
        console.log("user socket is created...")
    });

    socket.on('disconnect', () => {
        console.log(`Deleting socket: ${socket.id}`);
        for (user of users) {
            if (user.sockid.id == socket.id) {
                console.log("user socket is deleted ")
                users.delete(user)

            }
        }

        // console.log(`Remaining sockets: ${sockets.size}`);
    });

});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", originurl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//=================session================
app.use(session({

    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 420000, httpOnly: true }  //7 mins
    // cookie:{maxAge:7000 , httpOnly: true}
}))

app.use(passport1.initialize());

app.use(passport1.session());

//====================================================================
//==========User Registration
app.post('/register', function (req, res) {
    console.log("Registration...");
    const name = req.body.name;
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const email = req.body.email;
    const mno = req.body.mno;
    const otpforemail = req.body.OTP;
    const tempsess = req.session
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    var registerotpttl = req.session.registerotpttl

    if (new Date(registerotpttl) > new Date(timestamp)) {
        if (tempsess.email == email && tempsess.otpforemail == otpforemail) {

            const id = 'bcgt' + '_' + mno;
            database.view('addbeneficiary', 'mobileverification', function (err, body) {
                if (!err) {

                    var norecords;
                    norecords = true;
                    for (var i = 0; i < body.rows.length; i++) {
                        if (body.rows[i].value.mobilenumber != mno) {
                            if (body.rows[i].value.email != email) {
                                // console.log(body.rows[i].value.mobilenumber)
                                // console.log(body.rows[i].value.email)
                            }
                            else {
                                // console.log("already email is existed")
                                norecords = false;
                                res.json({ "res": "already email is existed" })
                                break;
                            }
                        }
                        else {
                            // console.log("already mobilenumber is existed")
                            norecords = false;
                            res.json({ "res": "already mobilenumber is existed" })
                            break;
                        }
                    }
                    if (norecords) {
                        /////insertion
                        database.insert({
                            _id: mno,
                            id: id,
                            name: name,
                            encryptedpwd: encrypt(key, password),

                            email: email,
                            status: true,
                            walletamount: 0,
                            mobilenumber: mno,
                            type: "user",
                            ledger: 0,
                        }, function (err, body) {

                            QRCode.toDataURL(id, function (err, url) {
                                if (!err) {
                                    console.log("qr code is generated");
                                    let data = url.replace(/.*,/, '')
                                    const img = new Buffer(data, 'base64')
                                    database.get(mno, { revs_info: true }, function (err, body) {
                                        var rev = body._rev;
                                        database.attachment.insert(mno, "img.png", img, 'image/png', { rev: rev }, function (err, body) {
                                            if (!err) {
                                                console.log("qr code is inserted");
                                            }
                                        })
                                    })
                                }
                            })
                        })
                        console.log("Record is inserted")
                        res.json({ "res": "success" })
                        ///////////////////end insertion
                    }
                    else {
                        console.log("Record is not inserted")

                    }
                }
            });
        }
        else {
            tempsess.count++;
            console.log(tempsess.count)



            if (tempsess.count >= 4) {
                console.log("called")
                res.json({ "res": "block" })

            }
            else {
                res.json({ "res": "OTPFAILED" })
            }
            console.log("OTP verification failed")

        }

    }
    else {
        res.json({ "res": "OTP-expired" });
    }





});
//=================================================


app.post('/login', passport1.authenticate('bank-local'), function (req, res) {



    res.status(200).send(req.user);

});
passport1.use('bank-local', new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function (res) {


            const a = username;
            const b = password;
            console.log("authentication using passport");
            console.log(a)
            database.get(a, function (err, body) {
                if (!err) {
                    const a1 = body.mobilenumber;
                    const b1 = body.encryptedpwd;
                    const b2 = decrypt(key, b1);
                    const status = body.status;
                    console.log(status)
                    if (status) {
                        if (b === b2) {
                            console.log("logged in");
                            return done(null, { message: 'success', "mobilenumber": body.mobilenumber, "name": body.name });

                        }
                        else {
                            console.log("entered incorrect password")
                            return done(null, { message: 'incorrectpassword' });
                        }
                    }
                    else {
                        console.log("your account is blocked")

                        return done(null, { message: 'block', num: a1 });
                    }

                }
                else {
                    console.log('Unknown user');
                    return done(null, { message: 'Unknownuser' });
                }
            })
        });

    }
));
passport1.serializeUser(function (body, done) {
    done(null, body);
    // console.log("serialize value" + body);
});
passport1.deserializeUser(function (body, done) {
    done(null, body);
});
//login with email
app.post('/api/getmobilenumber', function (req, res) {
    console.log("+++=")
    console.log(req.body)
    const uniqueid = req.body.username;
    const uField = req.body.uniquefield;
    console.log(uniqueid)
    console.log(uField)
    // kycid or other uniquefield
    getmobilenumber(uniqueid, uField, function (lookup) {
        if (lookup)
            res.json({ status: 'found', "mobilenumber": lookup });
        else
            res.json({ status: 'notfound' });
    });
});


getmobilenumber = function (uField, key, cb) {
    console.log('wallet' + uField + "   " + key);
    var srows = [];
    var mobilenumber
    database.view('addbeneficiary', 'mobileverification', function (err, body) {
        if (!err) {

            console.log('view lookup');
            console.log(body + "body");
            switch (key) {
                case '0':
                    j = 0;
                    for (var i = 0; i < body.rows.length; i++) {
                        srows[j++] = body.rows[i].value.mobilenumber;
                    }
                    break;
                case '1':
                    j = 0;
                    for (var i = 0; i < body.rows.length; i++) {
                        srows[j++] = body.rows[i].value.email;
                    }
                    break;

            }
            console.log(srows.length)
            for (var i = 0; i < srows.length; i++) {
                console.log(srows[i])
                console.log(uField)
                if (srows[i] == uField) {
                    console.log("match_found");
                    mobilenumber = body.rows[i].value.mobilenumber

                }

            }


            if (mobilenumber) {
                console.log(mobilenumber);
                cb(mobilenumber);

            }
            else
                cb(null)
        }
        else
            console.log('no');
    });

}

app.get("/retrievei", function (req, res) {

    console.log("retrieving QRcode...")
    const mobileno = req.session.passport.user.mobilenumber

    database.attachment.get(mobileno, 'img.png', function (err, body) {
        if (!err) {

            let buff = body;
            let base64data = buff.toString('base64');


            res.json({ "pic": base64data });
        }
        else {
            res.json({ "pic": "" });
            console.log(err);
        }
    });
});



//////////////////////
//=====================================
//change Password
app.post('/api/change', function (req, res) {
    console.log("********")
    const sess = req.session.passport.user

    console.log('Changing password...');

    const OTPfromsender = req.body.otp;
    console.log(OTPfromsender);
    console.log("!!!!!!!!" + req.session.passport.user.otpttl);
    var otpttlsendmoneytime = req.session.passport.user.otpttlforchange;
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    if (new Date(otpttlsendmoneytime) > new Date(timestamp)) {
        if (OTPfromsender == sess.otpfortransaction) {

            console.log(sess.otpfortransaction)
            console.log(sess.mobilenumber)
            database.get(sess.mobilenumber, function (err, body) {
                if (!err) {
                    const pwd = body.encryptedpwd;
                    const pwd6 = decrypt(key, pwd);
                    const pwd1 = req.body.cpwd1;
                    const pwd2 = req.body.cpwd2;
                    console.log(pwd);
                    console.log(pwd1)
                    if (pwd6 === pwd1) {
                        var obj = body;
                        console.log(obj)

                        obj.encryptedpwd = encrypt(key, pwd2);
                        console.log("********")
                        database.insert(obj, sess.mobilenumber, function (err, body) {
                            if (!err) {
                                console.log("********")
                                res.json({ result: "success" })
                                console.log("Password Updated");
                            }

                        });
                    }
                    else {
                        res.json({ result: "failed" });
                    }
                }

            });
        }
        else {
            sess.count++;
            console.log(sess.count)
            if (sess.count >= 4) {
                database.get(sess.mobilenumber, function (err, body) {
                    if (!err) {
                        var obj = body;
                        obj.status = false;
                        console.log(body);
                        database.insert(obj, function (err, body) {
                            if (!err) {
                                console.log("updated status success");
                                sess.count = 0;
                                res.json({ "result": "block" })

                            }
                            else {
                                res.json({ result: "failed" })
                                console.log("failed");
                            }
                        });
                    }
                });

            }
            else {
                res.json({ result: "OTPWRONG" })
            }
        }

    }
    else {
        res.json({ result: "OTP-expired" });
    }


})


//=======================================
//Add Beneficiry
app.post('/addbeneficiary', function (req, res) {
    var name = req.body.name;
    const mobileno = req.body.mno;
    const sess = req.session.passport.user;
    console.log("adding beneficiary ");
    if (mobileno == sess.mobilenumber) {
        console.log("Trying to Add own Mobile Number");
        res.json({ res: "You Cannot Add Your own Mobile Number" })
    }
    else {
        database.view('addbeneficiary', 'mobileverification', function (err, body) {
            if (!err) {
                console.log("called");
                console.log(body);
                var norecords;
                samemobile: true;
                norecords = true;
                for (var i = 0; i < body.rows.length; i++) {

                    if (body.rows[i].value.mobilenumber == mobileno) {
                        console.log(body.rows[i].value.mobilenumber)
                        console.log(mobileno + "jjjjj")
                        norecords = false;
                        if (name == '')
                            name = body.rows[i].value.name;

                        const id1 = 'ben' + '_' + mobileno + sess.mobilenumber;
                        req.session.id1 = id1;
                        this.id1 = req.session.id1;

                        /////insertion
                        // console.log(mobileno)
                        if ((body.rows[i].value.status)) {
                            database.insert({
                                _id: id1,
                                mobileno: mobileno,
                                name: name,
                                type: "beneficiary",
                                status: true,
                                mobilenumber: sess.mobilenumber,
                            }, function (err, body) {
                                if (!err) {
                                    res.json({ res: "success", beneficiaryid: id1 });
                                }
                                else {
                                    res.json({ res: "failed" })
                                }
                            });
                        }
                        else {
                            res.json({ res: "blocked" });
                        }

                        break;
                    }
                }
                if (norecords) {
                    res.json({ res: "Beneficiary mobilenumber not existed" });
                }
            }
            else {
                res.json({ res: "connection-error" });
            }
        });
    }
});


authchk = function (req, res, next) {
    if (!req.session.passport) {
        console.log("session expired");
        res.send({ "message": "sessionexpired" })
    }
    else {
        next();
    }
}
//getting amount
app.get('/getprofile', authchk, function (req, res) {

    const mobileno = req.session.passport.user.mobilenumber
    database.get(mobileno, function (err, body) {
        if (!err) {
            res.json(body)
        }
    });
});
//get beneficiary
app.get('/getbeneficiary', function (req, res) {

    console.log("getting beneficiary list");
    const sess = req.session.passport.user;
    database.view('view', 'beneficiary', function (err, body) {
        if (!err) {

            var beneficiary = [];
            var j = 0;
            for (var i = 0; i < body.rows.length; i++) {

                if (body.rows[i].value.mobilenumber == sess.mobilenumber) {

                    beneficiary[j++] = body.rows[i].value;
                }

            }

            res.send(beneficiary)
        }
    });
});


//=================================================================================
//code for deleting Beneficiary
app.post('/deletebeneficiary', function (req, res) {

    console.log("deleting beneficiary ");
    const id = req.body.id;
    const rev = req.body.rev;
    database.destroy(id, rev, function (err, body) {
        if (!err) {
            console.log("Beneficiary Deleted Successfully")
            res.json({ "res": "Beneficiary Deleted Successfully" });
        }
        else {
            console.log(err + "error")
            res.json({ "res": "error" })
        }

    });
});
//=========================================

app.post('/verifyemail', function (req, res) {
    tempsess = req.session;


    tempsess.email = req.body.email;
    tempsess.mnum = req.body.mno;

    database.view('verify', 'data', function (err, body) {
        if (!err) {
            var
                noemail = true;
            nomobile = true;
            for (var i = 0; i < body.rows.length; i++) {


                if (body.rows[i].value.mobilenum == tempsess.mnum) {

                    nomobile = false;

                    break;
                }

                if (body.rows[i].value.email == tempsess.email) {

                    noemail = false;

                    break;
                }
            }
            if (!nomobile || !noemail) {
                if (!nomobile) {
                    console.log("already mobile number is existed")
                    res.json({ "res": "mobile number is already exits" })
                }
                else {
                    res.json({ "res": "email is already exits" })
                    console.log("already email is existed")
                }
            }
            else {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25, // use SSL
                    auth: {
                        user: 'EWallet@blackcactusglobal.in',
                        pass: 'blackcactus'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                var gen = rn.generator({
                    min: 100000
                    , max: 999999
                    , integer: true
                })
                var otpttl = moment().add(120, 'seconds').format('YYYY-MM-DD hh:mm A');
                console.log(otpttl);
                req.session.count = 0;
                req.session.registerotpttl = otpttl;
                const id1 = gen();
                tempsess.otpforemail = id1;
                var HelperOptions = {
                    from: '"BCGT WALLET" <EWallet@blackcactusglobal.in>',
                    to: tempsess.email,
                    subject: "Email verification for Registration",
                    text: "OTP for verifying your E-mail id is " + id1,

                };
                transporter.sendMail(HelperOptions, function (err, info) {

                    if (err) {
                        res.json({ "res": "" })
                        console.log("error occured when sending mail")
                    }
                    else {
                        console.log("otp send  ");
                        res.json({ "res": "success" })

                    }
                });
            }
        }

    });

});
//////////forgot password///////
app.post('/forgot', function (req, res) {
    const tempsess = req.session
    const email = req.body.email;

    console.log("Forgot password OTP Initiated...")
    database.view('verify', 'data', function (err, body) {
        if (!err) {
            var noemail = true;
            console.log("**************1st time");
            for (var i = 0; i < body.rows.length; i++) {
                if (body.rows[i].value.email == email) {
                    noemail = false;
                    tempsess.mobilenum = body.rows[i].value.mobilenum;
                    const status = body.rows[i].value.status;
                    console.log(status)
                        ;
                    console.log(body.rows[i].value.email)
                    if (status) {

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            secure: true,
                            port: 25, // use SSL
                            auth: {
                                user: 'EWallet@blackcactusglobal.in',
                                pass: 'blackcactus'
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });
                        console.log(email)
                        var gen = rn.generator({
                            min: 100000
                            , max: 999999
                            , integer: true

                        })
                        var otpttl = moment().add(120, 'seconds').format('YYYY-MM-DD hh:mm A');
                        console.log(otpttl);
                        req.session.count = 0;
                        req.session.forgototpttl = otpttl;
                        const id1 = gen();
                        var HelperOptions = {
                            from: '"BCGT WALLET" <EWallet@blackcactusglobal.in>',
                            to: email,
                            subject: "Email verification for forgot password ",
                            text: "OTP for resetting your password  " + id1,
                            // res.json({"res":"success"})
                        };
                        tempsess.otpforforgetpw = id1
                        transporter.sendMail(HelperOptions, (err, info) => {
                            if (err) {
                                res.json({ "res": "" })
                                console.log("error occured when sending mail" + err)
                            }
                            else {
                                console.log("otp send to email");
                                res.json({ "res": "success" })

                            }
                        });
                    }
                    else {
                        res.json({ "res": "Blocked User" });
                    }
                }
            }
            if (noemail) {
                console.log("E-Mail is not existed " + email);
                res.json({ "res": "nomail" });
            }
        }
    })
});


////////////////////////////////////////////////////////////////////////////////////
//// Forgot password OTP verfication
app.post('/verifyOTPforforgotpassword', function (req, res) {
    console.log("Forgot password OTP Verification...")

    const tempsess = req.session
    console.log("tempsess" + tempsess);
    console.log(tempsess.mobilenum);
    var userotp = req.body.OTP1;
    // console.log(userotp)
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    console.log(req.session.forgototpttl)
    var forgototpttl = req.session.forgototpttl
    if (new Date(forgototpttl) > new Date(timestamp)) {
        if (tempsess.otpforforgetpw == userotp) {

            console.log("OTP verified successfully")
            res.json({ "res": "success" });
        }
        else {
            tempsess.count++;
            console.log(tempsess.count)
            if (tempsess.count >= 4) {
                database.get(tempsess.mobilenum, function (err, body) {
                    if (!err) {
                        var obj = body;
                        obj.status = false;
                        console.log(body);
                        database.insert(obj, function (err, body) {
                            if (!err) {
                                console.log("updated status success");
                                tempsess.count = 0;
                                res.json({ "res": "block" })

                            }
                            else {

                                console.log("failed");
                                res.json({ "res": "failed" })
                            }
                        });
                    }
                });

            }
            else {
                res.json({ "res": "wrong" })
            }
        }

    }
    else {
        res.json({ res: "OTPWRONG" });
    }

});
//=============================================================================
//Forgot passsword changing
app.post('/changeforgotpassword', function (req, res) {
    console.log("resetting password initiated...")
    const femail = req.body.femail;
    const newpwd = req.body.pwd2;
    database.view('verify', 'data', function (err, body) {
        if (!err) {
            var noemail = true;
            for (var i = 0; i < body.rows.length; i++) {
                if (body.rows[i].value.email == femail) {
                    const sess = body.rows[i].value.mobilenum;


                    // var alice = nano.db.use('bcgtwallet');

                    database.get(sess, function (err, body) {
                        var obj = body;

                        obj.encryptedpwd = encrypt(key, newpwd);
                        database.insert(obj, sess, function (err, body) {
                            if (!err) {
                                res.json({ "res": "success" })
                                console.log("Password Resetted successfully");
                            }
                            else {
                                res.json({ "res": "failed" })
                                console.log("Password Reset failed");
                            }

                        });


                    });
                }
            }
        }
    })

})
///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//changepassword OTP Functionality
app.post('/changepasssendOTP', function (req, res) {
    var old = req.body.pwd1;

    const mobileno = req.session.passport.user.mobilenumber;
    console.log(mobileno)

    database.get(mobileno, function (err, body) {
        if (!err) {

            console.log("body" + body.password)
            console.log(body.email)
            const pwd = body.encryptedpwd;
            console.log(pwd)
            const pwd5 = decrypt(key, pwd);
            var ownermail = body.email;

            if (old == pwd5) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25, // use SSL
                    auth: {
                        user: 'EWallet@blackcactusglobal.in',
                        pass: 'blackcactus'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                console.log(ownermail)
                var gen = rn.generator({
                    min: 100000
                    , max: 999999
                    , integer: true

                })
                var otpttl = moment().add(120, 'seconds').format('YYYY-MM-DD hh:mm A');
                console.log(otpttl);
                req.session.passport.user.count = 0;
                req.session.passport.user.otpttlforchange = otpttl;
                const id1 = gen();

                var HelperOptions = {
                    from: '"BCGT WALLET" <EWallet@blackcactusglobal.in>',
                    to: ownermail,
                    subject: "Email verification for change password",
                    text: "OTP for change password " + id1,

                };
                req.session.passport.user.otpfortransaction = id1;
                console.log(req.session.passport.user.otpfortransaction)
                transporter.sendMail(HelperOptions, (err, info) => {
                    if (err) {
                        res.json({ "res": "" })
                        console.log("error occured when sending E-mail" + err)
                    }
                    else {
                        console.log("otp send to E-mail ");
                        res.json({ "res": "success" })

                    }
                });
            }
            else {
                console.log("******************l")
                res.json({ "res": "password incorrect" })
            }
        }
    });
});



/////////////////////////////////////////////////////////////////////////////////////
//send OTP
app.post('/sendOTP', function (req, res) {
    var owneremail;
    console.log("OTP for transaction initiated...");
    console.log(req.body)
    const mobileno = req.session.passport.user.mobilenumber
    const idd = req.body.beneficiaryac;
    console.log("sv" + idd)
    database.get(idd, function (err, body1) {
        const reqmobileno = body1.mobileno;
        database.get(reqmobileno, function (err, body2) {
            if (!err) {

                const status = body2.status;
                console.log(status);
                if (status) {
                    // console.log("OTP for transaction", mobileno);
                    database.get(mobileno, function (err, body) {
                        if (!err) {
                            owneremail = body.email;
                            // console.log(owneremail + "SENDER")
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                secure: false,
                                port: 25, // use SSL
                                auth: {
                                    user: 'EWallet@blackcactusglobal.in',
                                    pass: 'blackcactus'
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
                            console.log(owneremail)
                            var gen = rn.generator({
                                min: 100000
                                , max: 999999
                                , integer: true

                            })

                            var otpttl = moment().add(120, 'seconds').format('YYYY-MM-DD hh:mm A');
                            console.log(otpttl);
                            req.session.passport.user.count = 0;
                            req.session.passport.user.otpttl = otpttl;
                            const id1 = gen();
                            var HelperOptions = {
                                from: '"BCGT WALLET" <EWallet@blackcactusglobal.in>',
                                to: owneremail,
                                subject: "Email verification for sending money",
                                text: "OTP for sending money " + id1,

                            };
                            req.session.passport.user.otpfortransaction = id1;
                            console.log(req.session.passport.user.otpfortransaction)
                            transporter.sendMail(HelperOptions, (err, info) => {
                                if (err) {
                                    res.json({ "res": "Error" });
                                    console.log("error occured when sending E-mail" + err)
                                }
                                else {
                                    console.log("otp send to E-mail ");
                                    res.json({ "res": "success" })

                                }
                            });
                        }
                    });
                }
                else {
                    console.log("blocked")
                    res.json({ "res": "blocked user" })
                }
            }

        });
    });
    // console.log(req.sessionID + " req");


});
//send money
//send money
app.post('/sendmoney', function (req, res) {
    console.log("Sending money initiated...");
    const sess = req.session.passport.user;

    console.log(req.body);
    var beneficiarynum;

    const amount = req.body.amount1;
    const beneficiaryac = req.body.beneficiaryac1;
    const reqid = req.body.id
    console.log("!!!!!!!!" + req.session.passport.user.otpttl);
    var otpttlsendmoneytime = req.session.passport.user.otpttl;
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    const OTPfromsender = req.body.otp;
    if (new Date(otpttlsendmoneytime) > new Date(timestamp)) {
        if (OTPfromsender == sess.otpfortransaction) {


            database.get(sess.mobilenumber, function (err, body) {

                if (!err) {
                    const dbamount = body.walletamount;
                    const ledger = body.ledger;

                    if (ledger < amount) {
                        console.log("gdjsg")
                        res.json({ "res": "Insufficient Funds" })
                    } else {

                        const sendernewwalletamount = Number(dbamount) - Number(amount);

                        database.get(sess.mobilenumber, function (err, body) {
                            var obj = body; var toname;
                            obj.walletamount = sendernewwalletamount;
                            obj.ledger = Number(obj.ledger) - Number(amount);
                            database.insert(obj, sess.mobilenumber, function (err, body) {
                                if (!err) {
                                    database.get(beneficiaryac, function (err, body) {
                                        var tomobilenumber = body.mobileno;
                                        var tonickname = body.name;
                                        database.get(tomobilenumber, function (err, body) {
                                            if (!err) {
                                                var obj = body;
                                                toname = body.name;
                                                const recdbamount = body.walletamount;
                                                const recvrnewwalletamount = Number(recdbamount) + Number(amount);
                                                obj.walletamount = recvrnewwalletamount;
                                                obj.ledger = Number(obj.ledger) + Number(amount);
                                                database.insert(obj, tomobilenumber, function (err, body) {
                                                    if (!err) {
                                                        var notified = false
                                                        var fromnickname = '';
                                                        database.view('view', 'beneficiary', function (err, body) {
                                                            if (!err) {
                                                                console.log("*********************")
                                                                var beneficiary = [];
                                                                var j = 0;
                                                                for (var i = 0; i < body.rows.length; i++) {
                                                                    console.log(body.rows[i].value);
                                                                    if (body.rows[i].value.mobilenumber == tomobilenumber && body.rows[i].value.mobileno == sess.mobilenumber) {
                                                                        // console.log(body.rows[i].value);     beneficiary[j++] = body.rows[i].value.name;
                                                                        fromnickname = body.rows[i].value.name;
                                                                        console.log(fromnickname + " nick name")
                                                                    }
                                                                }


                                                                console.log(fromnickname + " nick name")
                                                                console.log("amount Added to receiver..." + reqid)
                                                                database.get(reqid, function (err, sending) {
                                                                    if (!err) {
                                                                        var obj = sending;
                                                                        obj.sender_curr_bal = recvrnewwalletamount;
                                                                        obj.rcvr_curr_bal = sendernewwalletamount;
                                                                        obj.trans_status = "success";
                                                                        obj.isnotified = false;
                                                                        database.insert(obj, reqid, function (err, body) {

                                                                            if (!err) {
                                                                                console.log("********")
                                                                                res.json({ "res": "send" })
                                                                                var data = { "from": tomobilenumber, "to": sess.mobilenumber, fromname: '', toname: fromnickname, trans_status: "accepted", amount: amount, type: "requestmoney", id: reqid }

                                                                                var options = {
                                                                                    method: 'POST',
                                                                                    url: 'http://172.16.1.65:3000/postdata',
                                                                                    form: data,
                                                                                    json: true
                                                                                };

                                                                                var sendrequest = request(options, function (err, res, body1) {

                                                                                    if (!err) {
                                                                                        console.log(body1);
                                                                                        if (body1.res == "success") {
                                                                                            notified = true
                                                                                        }
                                                                                    }

                                                                                });
                                                                                for (const user of users) {
                                                                                    console.log(user)
                                                                                    if (user.mobilenum == tomobilenumber) {
                                                                                        console.log(tomobilenumber + "**************************")
                                                                                        //notified = true
                                                                                        user.sockid.emit('data', { data: fromnickname + "(" + sess.mobilenumber + ") Accept your money request", title: "Money Request", id: reqid });

                                                                                    }
                                                                                }
                                                                                for (const user of users) {
                                                                                    // console.log(user)
                                                                                    if (user.mobilenum == tomobilenumber || user.mobilenum == sess.mobilenumber) {
                                                                                        user.sockid.emit('new message', "ads")
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        );

                                                                    }


                                                                });






                                                            }
                                                        });

                                                    }




                                                    else {
                                                        console.log(err + "error while adding")
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                                else {
                                    console.log(err + "error")
                                }
                            });
                            console.log("amount");

                        });
                    }
                }

            });
        }
        else {
            sess.count++;
            console.log(sess.count)


            if (sess.count >= 4) {
                database.get(sess.mobilenumber, function (err, body) {
                    if (!err) {
                        var obj = body;
                        obj.status = false;
                        console.log(body);
                        database.insert(obj, function (err, body) {
                            if (!err) {
                                console.log("updated status success");
                                sess.count = 0;
                                res.json({ "res": "block" })

                            }
                            else {

                                console.log("failed");
                            }
                        });
                    }
                });

            }
            else {
                res.json({ res: "OTPWRONG" })
            }
        }

    }
    else {
        res.json({ "res": "OTP-expired" });
    }


});

//request money
app.post('/requestmoney', function (req, res) {
    const sess = req.session.passport.user;
    const beneficiaryac = req.body.beneficiaryac;
    const amount = req.body.amount;
    const comment = req.body.comment;
    console.log("requesting money...")

    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    var notified = false
    var requesternickname = '';

    //==================================================================================





    database.view('view', 'beneficiary', function (err, body) {
        database.get(beneficiaryac, function (err, body2) {
            if (!err) {

                const status = body2.status;
                const rcvr_curr_bal = body2.walletamount;
                const toname = body2.name

                if (status) {
                    if (!err) {

                        var beneficiary = [];
                        var j = 0;
                        for (var i = 0; i < body.rows.length; i++) {
                            //console.log(body.rows[i].value);
                            if (body.rows[i].value.mobilenumber == beneficiaryac && body.rows[i].value.mobileno == sess.mobilenumber) {
                                console.log(body.rows[i].value);
                                requesternickname = body.rows[i].value.name;
                                break;
                            }
                        }
                        var gen = rn.generator({
                            min: 100000000000
                            , max: 999999999999
                            , integer: true
                        })
                        const id1 = 'W2W' + gen().toString();
                        requesternickname = requesternickname || sess.name;
                        console.log(requesternickname + " nick name")
                        database.get(sess.mobilenumber, function (err, sessbody) {
                            sender_curr_bal = sessbody.walletamount;
                            database.insert({
                                _id: id1,
                                id: id1,
                                to: beneficiaryac,
                                totemp: beneficiaryac,
                                amount: amount,
                                In: amount,
                                out: amount,
                                comment: comment,
                                type: "moneyrequest",
                                from: sess.mobilenumber,
                                fromtemp: sess.mobilenumber,
                                fromname: sess.name,
                                toname: toname,
                                isnotified: notified,
                                timestamp: timestamp,
                                requesternickname: requesternickname,
                                trans_status: "pending",
                                sender_curr_bal: sender_curr_bal,
                                rcvr_curr_bal: rcvr_curr_bal
                            }, function (err, body) {
                                if (!err) {
                                    res.json({ result: "success" })
                                    console.log("request submitted");
                                    var data = { "from": sess.mobilenumber, "to": beneficiaryac, fromname: requesternickname, toname: toname, trans_status: "pending", amount: amount, type: "requestmoney", id: id1 }
                        var options = {
                            method: 'POST',
                            url: 'http://172.16.1.65:3000/postdata',
                            form: data,
                            json: true
                        };

                        var sendrequest = request(options, function (err, res, body1) {

                            if (!err) {

                                if (body1.res == "success") {
                                    // notified = true
                                }
                            }

                        });
                        for (const user of users) {
                            console.log(user.mobilenum)
                            if (user.mobilenum == beneficiaryac) {
                                console.log("user is online ")
                                // notified = true
                                user.sockid.emit('data', { data: requesternickname + "(" + sess.mobilenumber + ") sent you a money request", title: "Money Request", date: timestamp, id: id1 });
                            }
                        }
                                    for (const user of users) {

                                        if (user.mobilenum == beneficiaryac) {
                                            user.sockid.emit('new message', "ads")
                                        }
                                    }
                                }
                                else {
                                    res.json({ result: "failed" });
                                    console.log("request failed ");
                                }
                            });
                        });
                        //////////////////////////////////////////////////////////////////



                        /////////////////////////////////////////////////////////////////////////////////////////////////////
                        //Request Id Generation

                        //==============================================================

                    }
                }
                else {
                    res.json({ result: "block" });
                }
            }
        });


    });
});
app.post('/requestmsgUpdate1', function (req, res) {
    //console.log(req)
    const requestid = req.body.id;
    const trans_status = req.body.trans_status;
    const to = req.body.to;
    const toname = req.body.toname
    const from = req.body.from;
    const fromname = req.body.fromname
    const In = req.body.In;

    console.log("====================================================")
    console.log(requestid);
    console.log(trans_status);

    database.get(requestid, function (err, body) {
        if (!err) {
            var notified = false;
            console.log("Document Get");

            var obj = body;
            obj.trans_status = trans_status;
            obj.isnotified = notified;

            database.insert(obj, requestid, function (err, body) {
                if (!err) {
                    res.json({ result: "success" })
                    console.log("Request doc Updated");
                    var data = { "from": from, "to": to, fromname: fromname, toname: toname, trans_status: trans_status, amount: In, type: "requestmoney", id: requestid }
                    var options = {
                        method: 'POST',
                        url: 'http://172.16.1.65:3000/postdata',
                        form: data,
                        json: true
                    };

                    var sendrequest = request(options, function (err, res, body1) {

                        if (!err) {
                            console.log(body1);
                            if (body1.res == "success") {
                                notified = true
                            }
                        }

                    });
                    for (const user of users) {

                        if (user.mobilenum == to && trans_status == 'canceled') {

                            notified = true
                            user.sockid.emit('data', { data: fromname + "(" + from + ") has canceled the money request", title: "Request Money",id: requestid });

                        }
                        else if (user.mobilenum == from && trans_status == 'rejected') {

                            notified = true
                            user.sockid.emit('data', { data: toname + "(" + to + ") has rejected your money request", title: "Request Money",id: requestid });

                        }
                    }
                    for (const user of users) {
                        console.log(user.mobilenum)
                        if (user.mobilenum == to || user.mobilenum == from) {
                            user.sockid.emit('new message', "ads")
                        }
                    }
                }
                else {
                    res.json({ result: "failed" });
                }

            });






        }
        else {
            res.json({ result: "failed" });
        }
    });


})


app.post('/requestmsgUpdate', function (req, res) {
    //console.log(req)
    const requestid = req.body.id;
    const trans_status = req.body.trans_status;
    const to = req.body.to;
    const toname = req.body.toname
    const from = req.body.from;
    const fromname = req.body.fromname
    const In = req.body.In;

    console.log("====================================================")
    console.log(requestid);
    console.log(trans_status);

    database.get(requestid, function (err, body) {
        if (!err) {
            var notified = false;
            console.log("Document Get");
            var obj = body;
            obj.trans_status = trans_status;
            obj.isnotified = notified;


            database.insert(obj, requestid, function (err, body) {
                if (!err) {
                    res.json({ result: "success" })
                    console.log("Request doc Updated");

            var data = { "from": from, "to": to, fromname: fromname, toname: toname, trans_status: trans_status, amount: In, type: "sendmoney", id: requestid }
            var options = {
                method: 'POST',
                url: 'http://172.16.1.65:3000/postdata',
                form: data,
                json: true
            };

            var sendrequest = request(options, function (err, res, body1) {

                if (!err) {
                    console.log(body1);
                    if (body1.res == "success") {
                        notified = true
                    }
                }

            });
            for (const user of users) {

                if (user.mobilenum == from && trans_status == 'rejected') {

                    notified = true
                    user.sockid.emit('data', { data: toname + "(" + to + ") has rejected your money", title: "Send Money",id: requestid });

                }
            }


                    for (const user of users) {
                        console.log(user.mobilenum)
                        if (user.mobilenum == to || user.mobilenum == from) {
                            user.sockid.emit('new message', "ads")
                        }
                    }
                }
                else {
                    res.json({ result: "failed" });
                }

            });
   }
        else {
            res.json({ result: "failed" });
        }
    });
    database.get(from, function (err, body1) {
        if (!err) {
            var obj = body1;
            console.log(obj.ledger);
            obj.ledger = obj.ledger + Number(In)
            console.log(obj.ledger);
            database.insert(obj, from, function (err, body) {
                if (!err) {
                    console.log("status updated")
                }
            })
        }
    });

})


//======================================
///////////////////////////////////////////////////////////////////////////////////////



//==============================
//getting messages
app.get('/getmessage', function (req, res) {
    const sess = req.session.passport.user;
    console.log(req.session.passport)
    console.log(sess.mobilenumber)
    console.log(req.sessionID + " req");
    console.log("getting message of " + sess.mobilenumber)

    database.view('notifications', 'usernotifications', function (err, body) {
        if (!err) {

            database.view("view", "getbeneficiarybysessid", { key: sess.mobilenumber }, function (err, benbody) {
                if (!err) {

                    database.view('addbeneficiary', 'mobileverification', function (err, usersdata) {
                        if (!err) {

                            var beneficiary = []; var j = 0;
                            for (var i = 0; i < body.rows.length; i++) {

                                if (body.rows[i].value.to == sess.mobilenumber) {
                                    let checkbeneficiary = false;
                                    for (let k = 0; k < benbody.rows.length; k++) {
                                        if (benbody.rows[k].value.mobileno == body.rows[i].value.from) {
                                            body.rows[i].value.requesternickname = benbody.rows[k].value.name;
                                            checkbeneficiary = true;
                                            beneficiary[j++] = body.rows[i];
                                            break;
                                        }
                                    }
                                    if (!checkbeneficiary) {
                                        for (let k = 0; k < usersdata.rows.length; k++) {
                                            if (usersdata.rows[k].value.mobilenumber == body.rows[i].value.from) {
                                                body.rows[i].value.requesternickname = usersdata.rows[k].value.name;
                                                beneficiary[j++] = body.rows[i];
                                                break;
                                            }

                                        }
                                    }


                                }
                                else if (body.rows[i].value.from == sess.mobilenumber) {
                                    let checkbeneficiary = false;
                                    for (let k = 0; k < benbody.rows.length; k++) {
                                        if (benbody.rows[k].value.mobileno == body.rows[i].value.to) {
                                            body.rows[i].value.requesternickname = benbody.rows[k].value.name;
                                            checkbeneficiary = true;
                                            beneficiary[j++] = body.rows[i];
                                            break;
                                        }
                                    }
                                    if (!checkbeneficiary) {


                                        for (let k = 0; k < usersdata.rows.length; k++) {
                                            if (usersdata.rows[k].value.mobilenumber == body.rows[i].value.to) {
                                                body.rows[i].value.requesternickname = usersdata.rows[k].value.name;
                                                beneficiary[j++] = body.rows[i];
                                                break;
                                            }

                                        }


                                    }

                                }

                            }



                            beneficiary.sort(function (a, b) {
                                // Turn your strings into dates, and then subtract them
                                // to get a value that is either negative, positive, or zero.
                                return new Date(b.value.timestamp) - new Date(a.value.timestamp);
                            });
                            res.send(beneficiary);
                            // console.log("messages length ", beneficiary.length);
                            for (var i = 0; i < beneficiary.length; i++) {
                                if (beneficiary[i].value.isnotified == false && ((beneficiary[i].value.to == sess.mobilenumber && beneficiary[i].value.trans_status == 'pending') ||
                                    (beneficiary[i].value.from == sess.mobilenumber && beneficiary[i].value.trans_status == 'success') || (beneficiary[i].value.from == sess.mobilenumber && beneficiary[i].value.trans_status == 'rejected') ||
                                    (beneficiary[i].value.to == sess.mobilenumber && beneficiary[i].value.trans_status == 'canceled'))) {
                                    database.get(beneficiary[i].id, function (err, body) {
                                        if (!err) {
                                            var obj = body
                                            obj.isnotified = true;
                                            database.insert(obj, function (err, body) {
                                                if (!err) {
                                                    // console.log(body)
                                                    console.log("marked as read")
                                                }
                                            })

                                        }
                                    });
                                }
                            }
                        }
                    });
                }

            });



        }
    });
});

//======================================
//Add money
app.post('/moneyyy', function (req, res) {
    console.log("Adding money");
    const sess = req.session.passport.user;
    console.log(sess.mobilenumber);
    const cardtype = req.body.size;
    const cardnumber = req.body.dnumber;
    const transfamount = req.body.amount;
    const holdername = req.body.name;
    const cvvno = req.body.dcvv;
    const expmonth = req.body.dmonth;
    const expyear = req.body.dyear;

    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    var gen = rn.generator({
        min: 100000000000
        , max: 999999999999
        , integer: true
    })
    const id1 = 'TC' + gen().toString();
    console.log("getting card details")
    database.get(sess.mobilenumber, function (err, rcvrinfo) {
        if (!err) {
            console.log("got wallet details")
            console.log("checking card details")
            card.get(cardnumber, function (err, cardinfo) {
                if (!err) {
                    console.log("got card details")
                    console.log("getting wallet details")

                    if (cardinfo.type == cardtype &&
                        cardinfo.cvv == cvvno &&
                        cardinfo.name == holdername &&
                        cardinfo.mm == expmonth &&
                        cardinfo.yy == expyear) {
                        console.log("card details valid")
                        console.log("checking card balance")
                        if (cardinfo.amount < transfamount) {
                            console.log("insufficient balance")
                            database.insert({
                                _id: id1,
                                id: id1,
                                from: cardtype + "(" + cardnumber.toString().substr(0, 4) + "xxxxxxxx" + cardnumber.toString().substr(15, 19) + ")",
                                to: sess.mobilenumber,
                                toname: sess.name,
                                fromname: holdername,
                                timestamp: timestamp,
                                transferamount: Number(transfamount),
                                In: Number(transfamount),
                                trans_status: "failed",
                                sender_curr_bal: "N/A",
                                rcvr_curr_bal: Number(rcvrinfo.walletamount),
                                type: "self"
                            }, function (err, body) {
                                if (!err) {
                                    console.log("failed history created")
                                }
                            });
                            res.json({ res: "Insufficient Funds" })
                        }
                        else {
                            console.log("sufficient balance")
                            console.log("Transaction on process")
                            const sendernewbal = Number(cardinfo.amount) - Number(transfamount)
                            const rcvrnewbal = Number(rcvrinfo.walletamount) + Number(transfamount);
                            cardinfo.amount = sendernewbal;
                            rcvrinfo.walletamount = rcvrnewbal;
                            rcvrinfo.ledger = rcvrnewbal;
                            card.insert(cardinfo, cardnumber, function (err, body) {
                                if (!err) {
                                    console.log("amount deducted from card")
                                }
                                else {
                                    console.log("error while deducting from card")
                                }
                            },
                                database.insert(rcvrinfo, sess.mobilenumber, function (err, body) {
                                    if (!err) {
                                        console.log("amount added to wallet")
                                    }
                                    else {
                                        console.log("error while adding")
                                    }
                                },
                                    database.insert({
                                        _id: id1,
                                        id: id1,
                                        from: cardtype + "(" + cardnumber.toString().substr(0, 4) + "xxxxxxxx" + cardnumber.toString().substr(15, 19) + ")",
                                        fromname: holdername,
                                        to: sess.mobilenumber,
                                        toname: sess.name,
                                        timestamp: timestamp,
                                        transferamount: Number(transfamount),
                                        trans_status: "success",
                                        sender_curr_bal: "N/A",
                                        rcvr_curr_bal: Number(rcvrnewbal),
                                        type: "self",
                                        In: Number(transfamount)
                                    }, function (err, body) {
                                        if (!err) {
                                            console.log("transaction history created")
                                            res.json({ res: "Added Money Successfully" })
                                        }
                                        else {
                                            console.log("error while creating transaction history ")
                                        }
                                    })));
                        }
                    }
                    else {
                        console.log(err);
                        console.log("incorrect card details")
                        res.json({ res: "card details are not existed" })
                    }
                }
                else {
                    console.log(err);
                    console.log("card details are not existed")
                    res.json({ res: "card details are not existed" })
                }
            });
        }
    });
});
app.post('/api/logout', authchk, function (req, res) {
    console.log("logging out")
    console.log(req.sessionID)
    const sess = req.session.passport.user;

    for (const user of users) {

        if (user.mobilenum == sess.mobilenumber) {
            console.log(`${user.mobilenum} deleted from users`)
            users.delete(user);
        }
    }
    req.session.destroy(function (err) {
        if (!err) {
            console.log(`available users ${JSON.stringify(users)}`)
            req.logout();
            res.json({ res: "loggedout" })
        }
        else {
            res.json({ res: "sesssionexpired" })
            console.log(err);
        }

    });
});

app.post('/api/gettransactionhistory', function (req, res) {
    const sess = req.session.passport.user;
    var credit_history = []; var cj = 0;
    var debit_history = []; var dj = 0;
    var history = [];
    console.log("getting credit history")
    database.view("history", "credit_history", { key: sess.mobilenumber }, function (err, credits) {
        if (!err) {


            database.view("history", "debit_history", { key: sess.mobilenumber }, function (err, debits) {
                if (!err) {

                    database.view("view", "getbeneficiarybysessid", { key: sess.mobilenumber }, function (err, benbody) {
                        if (!err) {

                            database.view('addbeneficiary', 'mobileverification', function (err, usersdata) {
                                if (!err) {

                                    for (var i = 0; i < credits.rows.length; i++) {
                                        credits.rows[i].value.walletbal = String(credits.rows[i].value.walletbal)
                                        credits.rows[i].value.transferamount = String("₹" + credits.rows[i].value.transferamount)
                                        credits.rows[i].value.timestamp = String(credits.rows[i].value.timestamp)
                                        credits.rows[i].value.In = String("₹" + credits.rows[i].value.In)


                                        credit_history[cj++] = credits.rows[i].value;
                                    }
                                    for (var i = 0; i < debits.rows.length; i++) {
                                        debits.rows[i].value.transferamount = String("₹" + debits.rows[i].value.transferamount)
                                        debits.rows[i].value.walletbal = String(debits.rows[i].value.walletbal)
                                        debits.rows[i].value.timestamp = String(debits.rows[i].value.timestamp)
                                        debits.rows[i].value.out = String("₹" + debits.rows[i].value.out)

                                        debit_history[dj++] = debits.rows[i].value;
                                    }
                                    history = credit_history.concat(debit_history)

                                    // console.log("sorted");
                                    history.sort(function (a, b) {
                                        // Turn your strings into dates, and then subtract them
                                        // to get a value that is either negative, positive, or zero.
                                        return new Date(b.timestamp) - new Date(a.timestamp);
                                    });

                                    res.send(history);
                                    // console.log(history);
                                    for (var i = 0; i < history.length; i++) {
                                        if (history[i].isnotified == false && history[i].from != sess.mobilenumber) {

                                            database.get(history[i].id, function (err, body) {
                                                if (!err) {
                                                    var obj = body
                                                    obj.isnotified = true;
                                                    database.insert(obj, function (err, body) {
                                                        if (!err) {
                                                            // console.log(body)
                                                            // console.log("marked as read")
                                                        }
                                                    })

                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                    //////////////////////////
                }
            });
        }
    });
});

//==============qrscan======
app.post('/qrscan', function (req, res) {
    const sess = req.session.passport.user;
    database.view('verify', 'data', function (err, body) {
        if (!err) {
            var noemail;
            noemail = true;
            const mobile = req.body.data;
            for (var i = 0; i < body.rows.length; i++) {
                console.log(body.rows[i].id)
                if (body.rows[i].id == mobile) {
                    noemail = false;
                    console.log("body.rows[i].id == mobile " + body.rows[i].id + mobile)
                    if (sess.mobilenumber != mobile) {
                        console.log("sess.mobilenumber!=mobile" + sess.mobilenumber + mobile)

                        database.get(mobile, function (err, body) {

                            if (!err) {
                                console.log("Is mobile blocked " + body.status)
                                if (body.status == true) {
                                    console.log("qrscan")

                                    var name = body.name;
                                    const mobileno = mobile;
                                    var norecords = true;
                                    database.view('view', 'beneficiary', function (err, body) {
                                        const id1 = 'ben' + '_' + mobileno + sess.mobilenumber;
                                        console.log("bene id " + id1)
                                        for (var j = 0; j < body.rows.length; j++) {
                                            console.log("inside forloop")
                                            if (body.rows[j].id == id1) {
                                                console.log("bene already exists")
                                                console.log("ID " + body.rows[j].id)
                                                res.json({ res: "failed", id: body.rows[j].value })

                                            }
                                            else {
                                                database.insert({
                                                    _id: id1,
                                                    mobileno: mobileno,
                                                    name: name,
                                                    type: "beneficiary",
                                                    status: true,

                                                    mobilenumber: sess.mobilenumber,
                                                }, function (err, body) {
                                                    if (!err) {
                                                        console.log("bene success");
                                                        const bodyname = {
                                                            id: id1,
                                                            mobileno: mobileno,
                                                            name: name,
                                                            type: "beneficiary",
                                                            status: true,

                                                            mobilenumber: sess.mobilenumber
                                                        }
                                                        res.json({ res: "success", id: bodyname });
                                                    }
                                                });

                                            }
                                        }
                                        if (body.rows.length == 0) {
                                            database.insert({
                                                _id: id1,
                                                mobileno: mobileno,
                                                name: name,
                                                type: "beneficiary",
                                                status: true,

                                                mobilenumber: sess.mobilenumber,
                                            }, function (err, body) {
                                                if (!err) {
                                                    const bodyname = {
                                                        id: id1,
                                                        mobileno: mobileno,
                                                        name: name,
                                                        type: "beneficiary",
                                                        status: true,

                                                        mobilenumber: sess.mobilenumber
                                                    }
                                                    console.log("bene success" + bodyname)
                                                    res.json({ res: "success", id: bodyname });
                                                }
                                            });
                                        }
                                    });

                                }
                                else {
                                    res.json({ res: "blocked" })

                                }
                            }
                        });
                    }
                    else {
                        res.json({ res: "ownmobile" })
                        break;
                    }
                }
            }
            if (noemail) {
                res.json({ res: "notexist" })
            }


        }

    });

});

app.get('/getuserpass', authchk, function (req, res) {
    // console.log(req.sessionID + " req");
    // console.log(req.session)
    const mobileno = req.session.passport.user.mobilenumber
    database.get(mobileno, function (err, body) {
        if (!err) {
            const pass = decrypt(key, body.encryptedpwd);
            const mydata = {
                mobileno: mobileno,
                password: pass
            }
            console.log(mydata)
            res.json({ mydata })
        }
    });
});
app.post('/postdata', function (req, res) {
    console.log(req.body)
    let notified1 = false;
    for (const user of users) {

        if (user.mobilenum == req.body.to && req.body.trans_status == 'pending') {
            notified1 = true
            if (req.body.type == "requestmoney") {
                console.log("emitting money req")

                user.sockid.emit('data', { data: req.body.fromname + "(" + req.body.from + ") sent you a money request", title: "Money Request", date: req.body.timestamp, id: req.body.id });

            }
            else if (req.body.type == "sendmoney") {
                console.log("emitting send money")
                user.sockid.emit('data', { data: req.body.fromname + "(" + req.body.from + ") wants to sent you money", title: "Sending Money", id: req.body.id });

            }
            user.sockid.emit('new message', "ads")
        }
        else if (user.mobilenum == req.body.to && req.body.trans_status == 'canceled') {
            user.sockid.emit('data', { data: req.body.fromname + "(" + req.body.from + ") canceled the money request", title: "Money Request", date: req.body.timestamp, id: req.body.id });
            user.sockid.emit('new message', "ads")
        }

        else if (user.mobilenum == req.body.from && req.body.trans_status != 'pending') {

            if (req.body.type == "requestmoney") {
                user.sockid.emit('data', { data: req.body.toname + "(" + req.body.to + ")" + req.body.trans_status + " your money request", title: "Money Request", date: req.body.timestamp, id: req.body.id });
            }
            else if (req.body.type == "sendmoney") {
                user.sockid.emit('data', { data: req.body.toname + "(" + req.body.to + ")" + req.body.trans_status + " your money", title: "Sending Money", date: req.body.timestamp, id: req.body.id });
            }
            user.sockid.emit('new message', "ads")
        }
        if (user.mobilenum == req.body.to && req.body.trans_status == 'Accepted' && req.body.type == "sendmoney") {
            user.sockid.emit('data', { data: "Your wallet is credited with ₹" + req.body.amount, title: "Money Request", date: req.body.timestamp, id: req.body.id });
            user.sockid.emit('new message', "ads")
        }



    }

    if (notified1)
        res.json({ res: "success" });
    else
        res.json({ res: "nonotifications" });


});

//==========================================
app.post("/markasnotified", function (req, res) {
    const id = req.body.id;
    console.log(id+"*************")
    database.get(id, function (err, body) {
        console.log("err");

        console.log("body");
        console.log(body);
        if (!err) {

            var obj = body
            if(!obj.isnotified)
            {
                obj.isnotified = true;
                database.insert(obj, function (err, body) {
                    if (!err) {

                        console.log("marked as read")
                        res.json({msg:"MasN"});
                    }
                    else
                    {
                        res.send("error mark TESTING");
                    }
                })
            }


        }
        else{
            console.log(err);
        }

    });

})
//sending money
app.post('/sending', function (req, res) {
    const sess = req.session.passport.user;
    console.log("Sending money initiated...");


    console.log(req.body);
    var beneficiarynum;

    const amount = req.body.amount1;
    const beneficiaryac1 = req.body.beneficiaryac1;
    const comment = req.body.comment1;
    console.log("*hellooo**********" + beneficiaryac1)
    console.log("!!!!!!!!" + req.session.passport.user.otpttl);
    var otpttlsendmoneytime = req.session.passport.user.otpttl;
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    const OTPfromsender = req.body.otp;
    if (new Date(otpttlsendmoneytime) > new Date(timestamp)) {

        if (OTPfromsender == sess.otpfortransaction) {
            database.get(sess.mobilenumber, function (err, sessbody) {
                if(!err)
                {
                sender_curr_bal = sessbody.walletamount;
                const ledger = sessbody.ledger;
                const sendernewwalletamount1 = Number(ledger) - Number(amount);
                sessbody.ledger = sendernewwalletamount1;

                database.insert(sessbody, sess.mobilenumber, function (err, body) {

                    if (!err) {

                        var timestamp = new Date();
                        var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
                        var notified = false
                        var requesternickname;
                        database.get(beneficiaryac1, function (err, body1) {
                            const reqmobileno = body1.mobileno;
                            const benname = body1.name;
                            //==================================================================================
                            database.view('view', 'beneficiary', function (err, body) {
                                database.get(reqmobileno, function (err, body2) {
                                    if (!err) {

                                        const status = body2.status;
                                        const todbname=body2.name;
                                        const rcvr_curr_bal = body2.walletamount;
                                        console.log(status);
                                        if (status) {
                                            if (!err) {

                                                var beneficiary = [];
                                                var j = 0;
                                                for (var i = 0; i < body.rows.length; i++) {
                                                    console.log(body.rows[i].value);
                                                    if (body.rows[i].value.mobilenumber == reqmobileno && body.rows[i].value.mobileno == sess.mobilenumber) {
                                                        requesternickname = body.rows[i].value.name;
                                                        console.log(requesternickname + "iii");
                                                    }
                                                }
                                                var gen = rn.generator({
                                                    min: 100000000000
                                                    , max: 999999999999
                                                    , integer: true
                                                })
                                                const id1 = 'W2W' + gen().toString();
                                                requesternickname = requesternickname || sess.name;
                                                console.log(requesternickname + " nick name")

                                                database.insert({
                                                    _id: id1,
                                                    id: id1,
                                                    to: reqmobileno,
                                                    amount: amount,
                                                    comment: comment,
                                                    type: "sending",
                                                    from: sess.mobilenumber,
                                                    fromname: sess.name,
                                                    isnotified: false,
                                                    timestamp: timestamp,
                                                    requesternickname: requesternickname,
                                                    toname: todbname,
                                                    tonickname: benname,
                                                    In: amount,
                                                    out: amount,
                                                    sender_curr_bal: sender_curr_bal,
                                                    rcvr_curr_bal: rcvr_curr_bal,
                                                    trans_status: "pending"
                                                }, function (err, body) {
                                                    if (!err) {
                                                        res.json({ "res": "send" })
                                                        console.log("request submitted");
                                                        var data = { "from": sess.mobilenumber, "to": reqmobileno, fromname: requesternickname, toname: benname, trans_status: "pending", amount: amount, type: "sendmoney", id: id1 }
                                                        var options = {
                                                            method: 'POST',
                                                            url: 'http://172.16.1.65:3000/postdata',
                                                            form: data,
                                                            json: true
                                                        };

                                                        var sendrequest = request(options, function (err, res, body1) {

                                                            if (!err) {

                                                                if (body1.res == "success") {
                                                                    // notified = true
                                                                }
                                                            }

                                                        });

                                                        for (const user of users) {
                                                            console.log(user)
                                                            if (user.mobilenum == reqmobileno) {
                                                                console.log("user is online ")
                                                                notified = true
                                                                user.sockid.emit('data', { data: requesternickname + "(" + sess.mobilenumber + ") wants to sent you money", title: "Sending Money", date: timestamp, id: id1 });
                                                            }
                                                        }
                                                        for (const user of users) {
                                                            // console.log(user)
                                                            if (user.mobilenum == reqmobileno || user.mobilenum == sess.mobilenumber) {
                                                                user.sockid.emit('new message', "ads")
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        res.json({ res: "failed" });
                                                        console.log("request failed ");
                                                    }
                                                });




                                                /////////////////////////////////////////////////////////////////////////////////////////////////////
                                                //Request Id Generation

                                                //==============================================================

                                            }
                                        }
                                        else {
                                            res.json({ res: "block" });
                                        }
                                    }
                                });


                            });
                        })
                    }


                })
            }
            });

        }
        else {
            sess.count++;
            console.log(sess.count)


            if (sess.count >= 4) {
                database.get(sess.mobilenumber, function (err, body) {
                    if (!err) {
                        var obj = body;
                        obj.status = false;
                        console.log(body);
                        database.insert(obj, function (err, body) {
                            if (!err) {
                                console.log("updated status success");
                                sess.count = 0;
                                res.json({ "res": "block" })

                            }
                            else {

                                console.log("failed");
                            }
                        });
                    }
                });

            }
            else {
                res.json({ res: "OTPWRONG" })
            }
        }

    }

    else {
        res.json({ "res": "OTP-expired" });
    }
});
//credit money
app.post('/creditmoney', function (req, res) {
    var timestamp = moment().format('ddd, MMM D, YYYY hh:mm:ss A')
    console.log("hiiii")
    console.log(req.body)
    const sess = req.session.passport.user;
    const amount = req.body.value.In;
    const reqid = req.body.id
    const beneficiaryac = req.body.to;

    const mobilenumber = req.body.value.from;
    console.log(req.body.value.from+"kkkkk")

    database.get(mobilenumber, function (err, body) {

        if (!err) {



            const dbamount = body.walletamount;


            if (dbamount <= 0) {
                res.json({ res: "Insufficient Funds" });
            }

            else {
                const sendernewwalletamount = Number(dbamount) - Number(amount);
                console.log(sendernewwalletamount)

                database.get(mobilenumber, function (err, body) {

                    var obj = body;
                    var fromname = body.name;

                    obj.walletamount = sendernewwalletamount;

                    database.insert(obj, mobilenumber, function (err, body) {
                        if (!err) {

                            database.get(sess.mobilenumber, function (err, body) {
                                if (!err) {
                                    var obj = body;
                                    toname = body.name;
                                    console.log(toname + "susmitha+s")
                                    const recdbamount = body.walletamount;
                                    const recvrnewwalletamount = Number(recdbamount) + Number(amount);
                                    obj.walletamount = recvrnewwalletamount;
                                    obj.ledger = Number(obj.ledger) + Number(amount);
                                    database.insert(obj, sess.mobilenumber, function (err, body) {
                                        if (!err) {
                                            var notified = false
                                            var tonickname;
                                            database.view('view', 'beneficiary', function (err, body) {
                                                if (!err) {
                                                    var beneficiary = [];
                                                    var j = 0;
                                                    for (var i = 0; i < body.rows.length; i++) {
                                                        console.log(body.rows[i].value);
                                                        if (body.rows[i].value.mobilenumber == sess.mobilenumber && body.rows[i].value.mobileno == beneficiaryac) {
                                                            tonickname = body.rows[i].value.name;
                                                            console.log(tonickname + " nick name")
                                                        }
                                                    }

                                                    tonickname = tonickname || sess.name;

                                                    database.get(reqid, function (err, sending) {
                                                        if (!err) {
                                                            console.log("body getting")



                                                            var obj = sending;
                                                            console.log(obj.sender_curr_bal)
                                                            obj.sender_curr_bal = sendernewwalletamount;
                                                            obj.rcvr_curr_bal = recvrnewwalletamount;
                                                            obj.trans_status = "success";
                                                            obj.isnotified = false;
                                                            console.log(obj.id + "yyyyyyy")

                                                            database.insert(obj, obj.id, function (err, body) {
                                                                console.log(obj.sender_curr_bal + "vdgv")
                                                                if (!err) {
                                                                    console.log("********")
                                                                    res.json({ "res": "send" })
                                                                    var data = { "from": mobilenumber, "to": sess.mobilenumber, fromname: '', toname: tonickname, trans_status: "Accepted", amount: amount, type: "sendmoney", id: reqid }

                                                                    var options = {
                                                                        method: 'POST',
                                                                        url: 'http://172.16.1.65:3000/postdata',
                                                                        form: data,
                                                                        json: true
                                                                    };

                                                                    var sendrequest = request(options, function (err, res, body1) {

                                                                        if (!err) {
                                                                            console.log(body1);
                                                                            if (body1.res == "success") {
                                                                                notified = true
                                                                            }
                                                                        }

                                                                    });

                                                                    for (const user of users) {
                                                                        // console.log(user)
                                                                        if (user.mobilenum == sess.mobilenumber) {
                                                                            console.log(sess.mobilenumber + "**************************")

                                                                            user.sockid.emit('data', { data: "Your wallet is Credited with ₹" + amount, title: "Money Added to wallet", id: reqid, Amount: amount });

                                                                        }
                                                                        if (user.mobilenum == mobilenumber) {
                                                                            console.log(mobilenumber + "**************************")
                                                                            //notified = true

                                                                            user.sockid.emit('data', { data: tonickname + "(" + sess.mobilenumber + ")  Accepted your Money", title: "Money Debited", id: reqid, Amount: amount });

                                                                        }
                                                                    }
                                                                    for (const user of users) {
                                                                        // console.log(user)
                                                                        if (user.mobilenum == mobilenumber || user.mobilenum == sess.mobilenumber) {
                                                                            user.sockid.emit('new message', "ads")
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            );

                                                        }

                                                    });



                                                    console.log(sendernewwalletamount)
                                                    //////////////////////////////////////////////////////////////////////////////////////////
                                                    console.log("amount Added to receiver...")


                                                }
                                            });
                                        }




                                        else {
                                            console.log(err + "error while adding")
                                        }
                                    });
                                }
                            });

                        }
                        else {
                            console.log(err + "error")
                        }
                    });
                    console.log("amount");

                });

            }
        }
    });

});


//==========Forgetpassword fingerprint===================
app.post('/getforgetpass', function (req, res) {

    const femail = req.body.femail;

    database.view('verify', 'data', function (err, body) {
        if (!err) {
            var noemail = true;
            for (var i = 0; i < body.rows.length; i++) {
                if (body.rows[i].value.email == femail) {
                    const sess = body.rows[i].value.mobilenum;


                    // var alice = nano.db.use('bcgtwallet');

                    database.get(sess, function (err, body) {

                        if (!err) {
                            const pass = decrypt(key, body.encryptedpwd);

                            const mydata = {
                                mobileno: sess,
                                password: pass
                            }
                            console.log(mydata)
                            res.json({ mydata })
                        }

                    });
                }
            }
        }
    })

})
perf.stop();

server.listen(3000, function () {
    console.log('server started on port 3000');
});
