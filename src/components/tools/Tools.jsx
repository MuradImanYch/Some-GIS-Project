import './Tools.css';
import drawIco from '../../assets/draw.png';

const Tools = () => {
    return (
        <div className='tools'>
            <div className="btns">
                <button><img src={drawIco} alt="Draw Tool" /></button>
            </div>
        </div>
    );
};

export default Tools;