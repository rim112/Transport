var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');

var app = express();

//const bodyParser = require('body-parser');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123'));
//var session = driver.session();

app.get('/', function (req, res) {
    res.render('index');
    /*
    session
        .run("Match(n) RETURN n")
        .then(function (result) {
          var usagerArr = [];
            result.records.forEach (function (record) {
                usagerArr.push({
                    id: record._fields[0].identity.low,
                    AnneeNaissance: record._fields[0].properties.AnneeNaissance,
                    Handicap: record._fields[0].properties.Handicap,
                    Fonction: record._fields[0].properties.Fonction
                }); 
                console.log(record._fields[0]);
            });
            res.render('index', {
                usagers: usagerArr
            });
            session.close();
        })
        

        .catch(function (err) {
            console.log(err);
        });
*/
  

});
var session2 = driver.session();
app.post('/usager/add',function(req, res){

    var anneeParam = req.body.anneeNaissance;
    var handParam = req.body.handicap;
    var fonctionPram = req.body.fonction;
    var preferencePram =req.body.preference;
    var typeParam =req.body.type;
    
     session2
        .run(`match (ev:Transport) where ev.type='${typeParam}'
        create (s:usager {AnneeNaissance: '${anneeParam}',Handicap: '${handParam}',Fonction: '${fonctionPram}'}) 
        Merge (s) -[a:utilise {preference:'${preferencePram}'}]-> (ev)
        `)
        .then(function(result) { 
            res.redirect('/usagernew');
            session2.close();
        })
        .catch(function (err) {
            console.log(err);
        });

   
     
    
});
app.get('/usagernew',function(req, res){
    res.render('usager');
    //session3.close();
});
//var session3 = driver.session();
app.get('/Moyen',function(req, res){
    res.render('moyentran');
    //session3.close();
});
var session7 = driver.session();
app.post('/moyen/add',function(req, res){
    var typeParam = req.body.type;
    var nobusParam = req.body.nobus;
    var chauffeurbusParam = req.body.chauffeurbus;
    var notaxiParam = req.body.notaxi;
    var chauffeurtaxiParam = req.body.chauffeurtaxi;
    var NombrePlacestaxiParam = req.body.NombrePlacestaxi;
    var novoitureParam = req.body.novoiture;
    var chauffeurvoitParam = req.body.chauffeurvoit;
    var moyArr = [];
    if (typeParam=='bus'){
    session7
        .run(`match (ev:Transport) where ev.type='bus'
        create (s:Bus {Chauffeur: '${chauffeurbusParam}',no: ${nobusParam}}) 
        Merge (ev)-[:\`identifié par\`]-> (s)
        `)
        .then(function (result) {
            res.render('myentransres');
            session7.close();   
        })
        .catch(function (err) {
            console.log(err);
        });  }
        else {
            if(typeParam=='taxi'){
                session7
        .run(`match (ev:Transport) where ev.type='taxi'
        create (s:Taxi {Chauffeur: '${chauffeurtaxiParam}',no: ${notaxiParam}, NombrePlaces: ${NombrePlacestaxiParam}}) 
        Merge (ev)-[:\`identifié par\`]-> (s)
        `)
        .then(function (result) {
            res.render('myentransres');
            session7.close();   
        })
        .catch(function (err) {
            console.log(err);
        }); 
            }
            else {
                if(typeParam=='covoiturage'){
                    session7
            .run(`match (ev:Transport) where ev.type='covoiturage'
            create (s:Covoiturage {Chauffeur: '${chauffeurvoitParam}',no: ${novoitureParam}}) 
            Merge (ev)-[:\`identifié par\`]-> (s)
            `)
            .then(function (result) {
                res.render('myentransres');
                session7.close();   
            })
            .catch(function (err) {
                console.log(err);
            }); 
                }
            }
        }

});
app.get('/ajoutStation',function(req, res){
    res.render('ajoutMoy');
    //session3.close();
});
var session8 = driver.session();
var session10 = driver.session();
app.post('/station/add',function(req, res){

    var stationprecinterParam = req.body.Stationprecinter;
    var stationprecfiParam = req.body.Stationsuivfi;
    var stationsuivdeParam = req.body.Stationsuivde;
    var stationsuivinterParam = req.body.Stationsuivinter;
    var nominterParam = req.body.nominter;
    var nomdeParam = req.body.nomde;
    var nomfiParam = req.body.nomfi;
    var listinterParam = req.body.listinter;
    var listfiParam = req.body.listfi;
    var listdeParam = req.body.listde;
    var typeParam = req.body.type;
    var statParam = req.body.stat;
    var notransParam = req.body.notrans;
    var moyArr = [];
    if (statParam=='intermediaire'){
        session10
        .run(`match (ev:${typeParam}{no: '${notransParam}'})-[:\`passe par\`]->(statpre:station{Nom: '${stationsuivinterParam}'})
        ,(ev:${typeParam }{no: '${notransParam}'})-[:\`passe par\`]->(statsui:station{Nom: '${stationprecinterParam}'}),(statpre)-[r:suit]->(statsui),(statpre)<-[r2:suit]-(statsui)
DELETE r,r2
        `)
        .then(function (result) {
            session10.close(); 
        })
      
        .catch(function (err) {
            console.log(err);
        });
    session8
        .run(`match (ev:${typeParam}{no: '${notransParam}'})-[:\`passe par\`]->(statpre:station{Nom: '${stationsuivinterParam}'})
        ,(ev:${typeParam }{no: '${notransParam}'})-[:\`passe par\`]->(statsui:station{Nom: '${stationprecinterParam}'})
        create (s:station {Nom: '${nominterParam}',HeureArrivee: '${listinterParam}'})<-[:\`passe par\`]- (ev)
        WITH statpre,statsui,ev,s
        create (s) -[:suit]-> (statsui)
        WITH statpre,statsui,ev,s
        create (s) <-[:suit]- (statsui)
        WITH statpre,statsui,ev,s
        create (s) -[:suit]-> (statpre)
        WITH statpre,statsui,ev,s
        create (s) <-[:suit]- (statpre)
        WITH statpre,statsui,ev,s
        Match (ev)-[:\`passe par\`]->(stat)
        return ev,statsui,statpre,s,stat
        `)
        .then(function (result) {
          
            console.log(result.records[0]);
            result.records.forEach(element => moyArr.push({
                type: typeParam,
                station: element._fields[4].properties.Nom
              }));
            
            res.render('ajoutMoyres', {moyens: moyArr});
            session8.close();
            
        })
      
        .catch(function (err) {
            console.log(err);
            res.render('ajoutMoyres', {moyens: moyArr});
        });  }
        else{
            if (statParam=='debut'){
                session8
                    .run(`match (ev:${typeParam}{no: '${notransParam}'})-[:\`passe par\`]->(statsui:station{Nom: '${stationsuivdeParam}'}) 
                    create (s:station {Nom: '${nomdeParam}',HeureArrivee: '${listdeParam}'})<-[:\`passe par\`]-(ev)
                    WITH statsui,ev,s
                    create (s) -[:suit]-> (statsui)
                    WITH statsui,ev,s
                    create (s) <-[:suit]- (statsui)
                    WITH statsui,ev,s
                    Match (ev)-[:\`passe par\`]->(stat)
                    return ev,stat,s
                    `)
                    .then(function (result) {
                      
                        //console.log(result.records[0]._fields[3]);
                        result.records.forEach(element => moyArr.push({
                            type: typeParam,
                            station: element._fields[1].properties.Nom
                          }));
                        
                        res.render('ajoutMoyres', {moyens: moyArr});
                        session8.close();
                        
                    })
                  
                    .catch(function (err) {
                        console.log(err);
                        res.render('ajoutMoyres', {moyens: moyArr});
                    });  }
                    else{
                        if (statParam=='fin'){
                            session8
                                .run(`match (ev:${typeParam}{no: '${notransParam}'})-[:\`passe par\`]->(statsui:station{Nom: '${stationprecfiParam}'}) 
                                create (s:station {Nom: '${nomfiParam}',HeureArrivee: '${listfiParam}'})<-[:\`passe par\`]-(ev)
                                WITH statsui,ev,s
                                create (s) -[:suit]-> (statsui)
                                WITH statsui,ev,s
                                create (s) <-[:suit]- (statsui)
                                WITH statsui,ev,s
                                Match (ev)-[:\`passe par\`]->(stat)
                                return ev,statsui,s,stat
                                `)
                                .then(function (result) {
                                  
                                    console.log(result);
                                    result.records.forEach(element => moyArr.push({
                                        type: typeParam,
                                        station: element._fields[3].properties.Nom
                                      }));
                                      
                                    res.render('ajoutMoyres', {moyens: moyArr});
                                    session8.close();
                                    
                                })
                              
                                .catch(function (err) {
                                    console.log(err);
                                    res.render('ajoutMoyres', {moyens: moyArr});
                                });  }
                    }
                    
        }
});
app.get('/Transit',function(req, res){
    res.render('station');
    //session3.close();
});


var session4 = driver.session();
app.post('/Transit/add',function(req, res){

    var station1Param = req.body.Station1;
    var station2Param = req.body.Station2;
    var transitArr = [];
    session4
        .run(`MATCH p=(:station{Nom:"${station1Param}"})-[*1..4]->(:station{Nom:"${station2Param}"})
        RETURN [ n in nodes(p) | n] as list
        `)
        .then(function (result) {
          
          const iterator = result.records[0]._fields[0];
          for (const value of iterator) {
            //console.log(value.properties.HeureArrivee);
            transitArr.push({
                Nom: value.properties.Nom,
                HeureArrivee: value.properties.HeureArrivee
            });
            //console.log("......");
          }
          //console.log(transitArr);
          
          /*result.records[0]._fields[0].forEach (function (record) {
                transitArr.push({
                    Nom: record.properties.Nom,
                    HeureArrivee: record.properties.HeureArrivee
                });
                console.log(result.records[0]._fields[0].properties);
            });*/
            res.render('statres', {transits: transitArr});
            session4.close();
            
        })
      
        .catch(function (err) {
            console.log(err);
            res.render('statres', {transits: transitArr});
        });
       
     
    
     
    
});
app.get('/adequat',function(req, res){
    res.render('adequat');
    //session3.close();
});
var session6 = driver.session();
app.post('/adequat/add',function(req, res){

    var station1Param = req.body.Station1;
    var station2Param = req.body.Station2;
    var adequatArr = [];
    session6
        .run(`
        match (s1:station {Nom:"${station1Param}"}),(s2:station {Nom:"${station2Param}"}), 
        p=shortestPath((s1)-[:suit *1..5]->(s2))
        WITH s1,s2,[p,length(p)] as taille
        ORDER BY length(p) ASC
        WITH nodes(collect(taille)[0][0])[0] as s3
        match (s3)<-[:\`passe par\`]-(m)
        RETURN m
        `)
        .then(function (result) {
          console.log(result.records[0]._fields[0]);
          adequatArr.push({
            no: result.records[0]._fields[0].properties.no,
            type: result.records[0]._fields[0].labels[0],
            Chauffeur: result.records[0]._fields[0].properties.Chauffeur
        });
            res.render('adequatres', {adequats: adequatArr});
            session6.close();
            
        })
      
        .catch(function (err) {
            console.log(err);
            res.render('adequatres', {adequats: adequatArr});
        });   
});
app.get('/court',function(req, res){
    res.render('court');
    //session3.close();
});
var session5 = driver.session();
app.post('/court/add',function(req, res){

    var station1Param = req.body.Station1;
    var station2Param = req.body.Station2;
    var courtArr = [];
    session5
        .run(`match (s1:station {Nom:"${station1Param}"}),(s2:station {Nom:"${station2Param}"}), 
        p=shortestPath((s1)-[:suit *1..5]->(s2))
        WITH s1,s2,[p,length(p)] as taille
        ORDER BY length(p) ASC
        RETURN collect(taille)[0]
        `)
        .then(function (result) {
          //console.log(result.records[0]._fields[0][0].segments[0].relationship.properties.distanceKM);/*
          const iterator = result.records[0]._fields[0][0].segments;
          for (const value of iterator) {
            //console.log(value.properties.HeureArrivee);
            courtArr.push({
                start: value.start.properties.Nom,
                tempsMoyenmin: value.relationship.properties.tempsMoyenmin,
                distanceKM: value.relationship.properties.distanceKM,
                end: value.end.properties.Nom
            });
            //console.log("......");
          }
          //console.log(transitArr);
          
          /*result.records[0]._fields[0].forEach (function (record) {
                transitArr.push({
                    Nom: record.properties.Nom,
                    HeureArrivee: record.properties.HeureArrivee
                });
                console.log(result.records[0]._fields[0].properties);
            });*/
            res.render('courtres', {courts: courtArr});
            session5.close();
            
        })
      
        .catch(function (err) {
            console.log(err);
            res.render('courtres', {courts: courtArr});
        });   
});
/*

app.post('/transport/add', function (req, res) {

    var type = req.body.type;
    var no = req.body.no;
    var nbPlaces = req.body.nbPlaces;
    var chauffeur = req.body.chauffeur;

    session
        .run('CREATE(n:Transport{type:{typePram},no:{noParam},nbPlaces:{nbPlacesPram},chauffeur:{chauffeurParam}}) RETURN n', { typePram: type, noParam: no, nbPlacesPram: nbPlaces,chauffeurPram: chauffeur })
            .then(function (result) {
                res.redirect('/');
                session.close();
            })
            .catch(function (err) {
                console.log(err);
            });

    res.redirect('/');
});
*//*
app.post('/preference/add', function (req, res) {

    
    var Preference = req.body.preference;
  

        session
            .run('MATCH(a:Usager{AnneeNaissance:{anneePram}),(b:Transport{type:typePram}) MERGE(a)-[p:Preference]-(b) RETURN a,b', {
                anneePram: AnneeNaissance,typePram: type })
            .then(function (result) {
                res.redirect('/');
                session.close();
            })
            .catch(function (err) {
                console.log(err);
            });

    res.redirect('/');
});*/
app.listen(3000);
console.log('Server Started On Port 3000');

module.exports = app;
