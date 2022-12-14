import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import store from '../../store/store';
import Play from '../../shared/components/Play/Play';
import { selectBestPlay, setBestPlay, fetchAllPlayers, selectAllPlayers, upsertPlayer, getClosestPlayer, selectClosestPlayer } from '../GamePage/store/playerSlice';
import styles from './GameOverPage.module.scss';
import FormModal from '../../shared/components/FormModal/FormModal';
import { PlayerModel } from '../GamePage/store/playerModel';

function GameOverPage() {
    const { state } = useLocation();
    const bestPlay = useSelector(selectBestPlay);
    const players = useSelector(selectAllPlayers);
    const closest = useSelector(selectClosestPlayer);

    const [selectedPlayer, setSelectedPlayer] = useState<Partial<PlayerModel> | undefined>();
    const handleChange = (e: any) => setSelectedPlayer(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

    const triggerUpsert = (player: Partial<PlayerModel> | undefined) => {
        store.dispatch(setBestPlay({ name: player?.name, record: +(bestPlay.record ?? 0) }));
        store.dispatch((upsertPlayer({
            player: { id: player?.id, name: player?.name, record: player?.record?.toString() },
        })));
    }

    useEffect(() => {
        store.dispatch(fetchAllPlayers({}));
        store.dispatch(setBestPlay({ record: state?.points }));
        store.dispatch(getClosestPlayer({ record: +(bestPlay.record ?? 0) }));
        setSelectedPlayer({ id: bestPlay.id, name: bestPlay.name, record: (bestPlay.record ?? 0) > state?.points ? bestPlay.record : state?.points });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPosition = () => {
        if (closest?.record === bestPlay.record) {
            return closest?.rank;
        }
        return (+(closest?.record ?? 0) > +(bestPlay.record ?? 0)) ? +(closest?.rank ?? 1) + 1 : closest?.rank ?? 0
    }

    return (
        <div className="overflow-auto HideScrollbars inline-block relative min-w-full min-h-fit h-full object-cover">
            <section className="pt-16 h-fit" data-testid="GameOverPage">
                <div className="text-white h-fit HideScrollbars">
                    <section className="LinkTopContainer">
                        <section className="min-w-fit mr-4 mt-2">
                            <Link to="/admin" className='LinkTop'>
                                <span>{"admin"}</span>
                            </Link>
                        </section>
                        <section className="min-w-fit mr-4 mt-2">
                            <a href="https://github.com/SamuelSlavka/game">
                                <span className='LinkTop'>{"git"}</span>
                            </a>
                        </section>
                    </section>
                    <section className="LinkTopContainer AlignLeft">
                        <label htmlFor="edit-modal" className="btn btn-outline btn-primary text-center font-bold">
                            Save to leaderboard
                        </label>
                    </section>

                    <h1 className={styles.HeaderText}>
                        Game over
                    </h1>
                    <section className="w-full flex justify-center hover:text-light ease-in-out duration-200">
                        <span className="text-center text-xl">
                            You got <span className='font-bold'> {state?.points ?? 0} </span> points
                        </span>
                    </section>
                    { bestPlay.record ?
                    <section className="w-full flex justify-center hover:text-light ease-in-out duration-200  mt-4 mb-8">
                        <span className="text-center text-xl">
                            Your best
                            <span className='font-bold'> {bestPlay.record} </span>
                            points is position
                            <span className='font-bold'> {getPosition()} </span>
                            in the leaderboard
                        </span>
                    </section> : <></>}
                    <div className="flex justify-center mb-8">
                        <Link to="/">
                            <button className="btn btn-primary text-center font-bold">
                                <span>{"Play Again"}</span>
                            </button>
                        </Link>
                    </div>
                    <h5 className="text-center text-l font-bold hover:text-light ease-in-out duration-200">
                        Global Leaderboard
                    </h5>

                    <input type="checkbox" id="edit-modal" className="modal-toggle" />
                    <FormModal selectedPlayer={selectedPlayer} handleChange={handleChange} triggerUpsert={triggerUpsert} />
                    <div className="flex justify-center pt-4">
                        <section className='w-xs max-w-fit'>
                            {players.map(player => <Play key={player.id} player={player} setSelectedPlayer={() => { }} />)}
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default GameOverPage;
