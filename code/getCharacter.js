var http = require('http')
var console = require('console')

function buildCharacterShort(link) {
  let resident = http.getUrl(link, { format: 'json' })
  return {
    name: resident.name,
    image: resident.image
  }
}

function buildLocation(link) {
  let location = http.getUrl(link, { format: 'json' })
  var ret = {
    name: location.name ? location.name : 0,
    type: location.type ? location.type : 0,
    dimension: location.dimension ? location.dimension : 0,
    residents: []
  }

  if (location.residents)
    location.residents.forEach((url) => {
      ret.residents.push(buildCharacterShort(url))
    })

  return ret
}


function buildEpisodes(episodes) {
  var ret = []
  episodes.forEach((url) => {
    let data = http.getUrl(url, { format: 'json' })
    var tmp = {
      name: data.name,
      airDate: data.air_date,
      number: data.episode,
      characters: []
    }
    // data.characters.forEach((url) => {
    //   tmp.characters.push((buildCharacterShort(url)))
    // })
    ret.push(tmp)
  })

  return ret
}

function buildCharacter(i) {
  let character = http.getUrl("https://rickandmortyapi.com/api/character/" + i, { format: 'json' })
  var ret = {}

  character.name ? ret.name = character.name : 0
  character.status ? ret.status = character.status : 0
  character.species ? ret.species = character.species : 0
  character.gender ? ret.gender = character.gender : 0
  character.type ? ret.type = character.type : 0
  character.image ? ret.image = character.image : 0
  character.origin ? ret.origin = buildLocation(character.origin.url) : 0
  character.location ? ret.location = buildLocation(character.location.url) : 0
  character.episode ? ret.episode = buildEpisodes(character.episode) : 0

  return ret
}

module.exports.function = function getCharacter(characterShort, search) {

  if (characterShort)
    search = characterShort.name
  for (var i = 1; i < 395; i++)
    if (http.getUrl("https://rickandmortyapi.com/api/character/" + i, { format: 'json' }).name.toLowerCase().includes(search.toLowerCase()))
      return buildCharacter(i)
}
