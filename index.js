const fs = require('fs');

const { martyrs } = require('./theaters/martyrs')
const { theatrenational } = require('./theaters/theatrenational')
const { tanneurs } = require('./theaters/tanneurs')
const { theatreduparc } = require('./theaters/theatreduparc')
const { poche } = require('./theaters/poche')
const { theatredelavie } = require('./theaters/theatredelavie')
const { varia } = require('./theaters/varia')
const { trg } = require('./theaters/trg')
const { richesclaires } = require('./theaters/richesclaires')
const { ToisonDor } = require('./theaters/toisondor')
const { balsamine } = require('./theaters/balsamine')
const { lerideau } = require('./theaters/lerideau')
const { CentreCultureAuderghem } = require('./theaters/ccauderghem')
const { chapeau } = require ('./theaters/chapeau')

const main = async () => {
    let plays = [
        ...await martyrs(), 
        ...await theatrenational(),
        ...await poche(),
        ...await theatreduparc(),
        ...await tanneurs(),
        ...await theatredelavie(),
        ...await varia(),
        ...await trg(),
        ...await richesclaires(),
        ...await ToisonDor(),
        ...await balsamine(),
        ...await lerideau(),
        ...await CentreCultureAuderghem(),
        ...await chapeau()
    ]

    // console.log(plays)
    
    fs.writeFile('plays2.json', JSON.stringify(plays), function (err) {
        if (err) throw err;
    });
    
    // const y = plays.sort((a, b) => a.title > b.title)
    // console.log(y)
}

main()

// const callMain = () => main()

// exports.callMain = callMain