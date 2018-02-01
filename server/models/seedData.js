const uuid = require('uuid');

const countries = [
  {
    countryId: 1,
    name: 'Lakers',
    players: [
      { 
        name: 'Robin Lopez',
        playerId: 'f1303558-192d-4cc3-851b-298f1c66b5e6'
      },
      { 
        name: 'Lonzo Ball',
        playerId: '0633d4bb-ac71-4487-b6de-47bfae06307f'
      },
      { 
        name: 'Julius Randle',
        playerId: '1557982b-acce-46af-a0bb-2464ef456491'
      },
      { 
        name: 'Kyle Kuzma',
        playerId: 'c70342bf-be9b-420f-a673-20fb06e5c48a'
      },
      { 
        name: 'Brandon Ingram',
        playerId: '1fd860ae-196c-44a5-a021-31c0fbb03bb6'
      },
    ],
  },
  {
    countryId: 2,
    name: 'Timberwolves',
    players: [
      { 
        name: 'Jeff Teague',
        playerId: 'effa34e4-969d-4700-914e-deb5cdc827b3'
      },
      { 
        name: 'Jimmy Butler',
        playerId: '5a17f131-d5fb-4aee-9739-b43b7d3ad35a'
      },
      { 
        name: 'Karl Anthony Towns',
        playerId: '59cf6efc-7b0f-4bf2-8394-f37ddc240fda'
      },
      { 
        name: 'Andrew Wiggins',
        playerId: '936c69e3-cfc4-4611-b5f4-6ac4b701873e'
      },
      { 
        name: 'Taj Gibson',
        playerId: 'acf0b80e-81f9-457a-93eb-b8f4ded96511'
      },
    ],
  },
  {
    countryId: 3,
    name: 'Warriors',
    players: [
      { 
        name: 'Stephen Curry',
        playerId: '219953be-c0ac-4b76-a34d-78b34663d0ad'
      },
      { 
        name: 'Klay Thompson',
        playerId: 'e029391d-49bd-4050-ba73-6403d1cb95b7'
      },
      { 
        name: 'Draymond Green',
        playerId: 'e8fa4a40-2faf-4d39-a4e4-a4144490b71c'
      },
      { 
        name: 'Kevin Durant',
        playerId: 'b82159e2-5820-4e53-81fd-edff0f2b1a6f'
      },
      { 
        name: 'Zaza Pachulia',
        playerId: 'bcde84ff-f62c-4d75-87cf-4a70708ee5dd'
      },
    ],
  },
  {
    countryId: 4,
    name: 'Cavaliers',
    players: [
      { 
        name: 'Lebron James',
        playerId: 'dfeeef99-8123-47a7-a229-23640253c901'
      },
      { 
        name: 'Isaiah Thomas',
        playerId: '8187bc5b-d6d5-4f1e-8a6c-3738e57b2de5'
      },
      { 
        name: 'Tristan Thompson',
        playerId: 'd39a8f7f-c910-457c-aee9-f9746a569cf3'
      },
      { 
        name: 'Kevin Love',
        playerId: '6469d362-eecf-4b7e-88af-b56091182c28'
      },
      { 
        name: 'JR Smith',
        playerId: '74c2982e-ef33-48ce-b9dd-f61c416d8f60'
      },
    ],
  },
  {
    countryId: 5,
    name: 'Celtics',
    players: [
      { 
        name: 'Kyrie Irving',
        playerId: 'cddf156a-82b9-49ef-a549-5a91bd2befe9'
      },
      { 
        name: 'Gordon Hayward',
        playerId: 'ee9f60bf-9aa2-44c7-8d5b-0566ef144c02'
      },
      { 
        name: 'Al Horford',
        playerId: 'cfa2aeae-8882-48f4-b08d-7e6ce67cd609'
      },
      { 
        name: 'Jaylen Brown',
        playerId: '0e17fc88-a989-453d-b357-5282f531da3e'
      },
      { 
        name: 'Marcus Smart',
        playerId: '792c514c-0e39-49e0-b0e0-3ff04f7bd1fd'
      },
    ],
  },
  {
    countryId: 6,
    name: 'Thunders',
    players: [
      { 
        name: 'Russel Westbrook',
        playerId: '5d270845-0c3c-4eff-88a3-5a8da69a79ff'
      },
      { 
        name: 'Carmelo Anthony',
        playerId: 'cc87a8ac-4a1d-415b-87f4-21a33e112bce'
      },
      { 
        name: 'Paul George',
        playerId: '9c082634-58cf-4500-8320-9b7dc149dfbd'
      },
      { 
        name: 'Andre Roberson',
        playerId: 'ac7299e7-0a85-473e-8ecd-58657c8be023'
      },
      { 
        name: 'Steven Adams',
        playerId: '9055b6d8-66dc-4774-8ff4-3f2e088a2d8d'
      },
    ],
  },
];

module.exports = { countries };
