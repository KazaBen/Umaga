//client/App.js
import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
    // initialize our state
    state = {
        data: [],
        champById: {
            _id: "",
            name: ""
        }
    };

    // just a note, here, in the front end, we use the id key of our data object
    // in order to identify which we want to Update or delete.
    // for our back end, we use the object id assigned by MongoDB to modify
    // data base entries
    getDataFromDb = () => {
        fetch('http://localhost:3001/api/getData')
            .then((data) => data.json())
            .then((res) => this.setState({ data: res.data }));
    };


    getOneChampById = (id) => {
        fetch('http://localhost:3001/api/getOneChamp/' + id)
            .then((data) => data.json())
            .then((res) => {
                this.setState({ champById: res.data })
            });
    };

    removeOneChampById = (id) => {
        fetch('http://localhost:3001/api/removeOneChamp/' + id)
            .then((data) => data.json())
            .then((res) => {
            });
    };

    // our first get method that uses our backend api to
    // fetch data from our data base
    getDataFromPandas = () => {
        fetch('https://api.pandascore.co/lol/champions?token=7kQQkwbXjlSUhK954nWb_Tllp3K13rmJmZRLybkH6Y3-ePZr9wk')
            .then((data) => data.json())
            .then((res) => {
                console.log(res);
                var champs = [];
                for(var i = 0; i < res.length; i++) {
                    champs.push({
                        name: res[i].name,
                        armor: res[i].armor,
                        hp: res[i].hp,
                        mana: res[i].mp,
                        attackDamage: res[i].attackdamage
                    });
                }


                for(var i = 0; i < 1; i++) {
                    this.putDataToDB(champs[]);
                }
            });
    };

    // our put method that uses our backend api
    // to create new query into our data base
    putDataToDB = ({name, armor, hp, mana, attackDamage}) => {
        axios.post('http://localhost:3001/api/putData', {
            name : name,
            armor : armor,
            attackDamage : attackDamage,
            mana : mana,
            hp : hp
        });
    };

    // our update method that uses our backend api
    // to overwrite existing data base information
    updateDB = (idChamp, newName, newArmor,
    newAttackDamage, newMana, newHp) => {


        axios.post('http://localhost:3001/api/updateChamp', {
            idChamp: idChamp,
            champ: {
                name: newName,
                armor: parseInt(newArmor),
                attackDamage: parseInt(newAttackDamage),
                mana: parseInt(newMana),
                hp: this.state.newHp
            }

        });
    };

    // here is our UI
    // it is easy to understand their functions when you
    // see them render into our screen
    render() {
        const { data } = this.state;
        return (
            <div>
                <ul>
                    {data.length <= 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (
                            <li style={{ padding: '10px' }}>
                                <span style={{ color: 'gray' }}> name: </span> {dat.name} <br />
                                <span style={{ color: 'gray' }}> id: </span> {dat._id} <br />
                                <span hp={{ color: 'gray' }}> hp: </span> {dat.hp} <br />
                                <span mana={{ color: 'gray' }}> mana: </span> {dat.mana} <br />
                                {dat.message}
                            </li>
                        ))}
                </ul>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idChamp: e.target.value })}
                        placeholder="id of the champion"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ newName: e.target.value })}
                        placeholder="new name"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ newArmor: e.target.value })}
                        placeholder="new armor"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ newAttackDamage: e.target.value })}
                        placeholder="new attack damage"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ newMana: e.target.value })}
                        placeholder="new mana"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ newHp: e.target.value })}
                        placeholder="new hp"
                    />

                    <button
                        onClick={() =>
                            this.updateDB(this.state.idChamp, this.state.newName, this.state.newArmor,
                                this.state.newAttackDamage, this.state.newMana, this.state.newHp)
                        }
                    >
                        UPDATE CHAMP TO DATABASE
                    </button>
                    <button
                        onClick={() =>
                            this.getDataFromDb()
                        }
                    >
                        PRINT EVERYTHING IN DATABASE
                    </button>
                    <button
                        onClick={() =>
                            this.getDataFromPandas()
                        }
                    >
                        UPDATE DATABASE FROM THE LOLO WEBSITO API
                    </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        onChange={(e) => this.setState({ getChampById: e.target.value })}
                        placeholder="Get champ by id"
                        style={{ width: '200px' }}
                    />
                    <button onClick={() => this.getOneChampById(this.state.getChampById)}>
                        GET CHAMP BY ID FROM DATABASE
                    </button>
                </div>


                <li style={{ padding: '10px' }}>
                    <span style={{ color: 'gray' }}> id: {this.state.champById._id}</span> <br />
                    <span style={{ color: 'gray' }}> name: {this.state.champById.name}</span> <br />
                </li>


                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        onChange={(e) => this.setState({ removeChampById: e.target.value })}
                        placeholder="Remove champ by id"
                        style={{ width: '200px' }}
                    />
                    <button onClick={() => this.removeOneChampById(this.state.removeChampById)}>
                        REMOVE CHAMP BY ID
                    </button>
                </div>




            </div>


        );
    }
}

export default App;
