import './Tools.css';
import drawIco from '../../assets/draw.png';
import editIco from '../../assets/edit.png';
import deleteIco from '../../assets/delete.png';
import selectIco from '../../assets/select.png';
import pointIco from '../../assets/point.png';
import lineIco from '../../assets/line.png';
import polygonIco from '../../assets/polygon.png';

const Tools = ({drawToggle, toggleDrawFunc, changeDraw, drawType, toggleSelectFunc, selectActive}) => {
    return (
        <div className='tools'>
            <div className="btns">
                <button className={drawToggle ? 'active' : ''} onClick={() => {toggleDrawFunc()}}><img src={drawIco} alt="Draw" title='Draw' /></button>
                <button><img src={editIco} alt="Edit" title='Edit' /></button>
                <button><img src={deleteIco} alt="Delete" title='Delete' /></button>
                <button className={selectActive ? 'active' : ''} onClick={() => {toggleSelectFunc()}}><img src={selectIco} alt="Select" title='Select' /></button>
            </div>
            {drawToggle && (
                <div className="drawBtns">
                    <button className={drawType === 'Point' ? 'active' : ''} onClick={() => {changeDraw('Point')}}><img src={pointIco} alt="Point" title='Point' /></button>
                    <button className={drawType === 'LineString' ? 'active' : ''} onClick={() => {changeDraw('LineString')}}><img src={lineIco} alt="Line" title='Line' /></button>
                    <button className={drawType === 'Polygon' ? 'active' : ''} onClick={() => {changeDraw('Polygon')}}><img src={polygonIco} alt="Polygon" title='Polygon' /></button>
                </div>
            )}
        </div>
    );
};

export default Tools;