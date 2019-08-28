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


                for(var i = 0; i < champs.length; i++) {
                    this.putDataToDB(champs[i]);
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

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete) => {
        parseInt(idTodelete);
        let objIdToDelete = null;
        this.state.data.forEach((dat) => {
            if (dat.id == idTodelete) {
                objIdToDelete = dat._id;
            }
        });

        axios.delete('http://localhost:3001/api/deleteData', {
            data: {
                id: objIdToDelete,
            },
        });
    };

    // our update method that uses our backend api
    // to overwrite existing data base information
    updateDB = (idToUpdate, updateToApply) => {
        let objIdToUpdate = null;
        parseInt(idToUpdate);
        this.state.data.forEach((dat) => {
            if (dat.id == idToUpdate) {
                objIdToUpdate = dat._id;
            }
        });

        axios.post('http://localhost:3001/api/updateData', {
            id: objIdToUpdate,
            update: { message: updateToApply },
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
                                {dat.message}
                            </li>
                        ))}
                </ul>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        onChange={(e) => this.setState({ message: e.target.value })}
                        placeholder="add something in the database"
                        style={{ width: '200px' }}
                    />
                    <button onClick={() => this.putDataToDB(this.state.message)}>
                        ADD
                    </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idToDelete: e.target.value })}
                        placeholder="put id of item to delete here"
                    />
                    <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                        DELETE
                    </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idToUpdate: e.target.value })}
                        placeholder="id of item to update here"
                    />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApply: e.target.value })}
                        placeholder="put new value of the item here"
                    />
                    <button
                        onClick={() =>
                            this.updateDB(this.state.idToUpdate, this.state.updateToApply)
                        }
                    >
                        UPDATE
                    </button>
                    <button
                        onClick={() =>
                            this.getDataFromDb()
                        }
                    >
                        UPDATE ENTRIES
                    </button>
                    <button
                        onClick={() =>
                            this.getDataFromPandas()
                        }
                    >
                        UPDATE DATABASE
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
                        GET CHAMP BY ID
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
