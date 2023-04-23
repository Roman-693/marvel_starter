import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charsData, setCharsData] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] =useState(false);    

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded);
    };

    const onCharsLoaded = (newCharsData) => {
        let ended = false;

        if (newCharsData.length < 9) {
            ended = true;
        }

        setCharsData(charsData => [...charsData, ...newCharsData]);        
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    };

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    };
        
    function renderItems(arr) {
        const content = arr.map((char, i) => {            
            const {id, name, thumbnail} = char;            
            let imgStyle = {'objectFit' : 'cover'};    
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <CSSTransition key={id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={domElement => itemRefs.current[i] = domElement}
                        onClick={() => {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(event) => {
                            if (event.key === ' ' || event.key === 'Enter') {
                                props.onCharSelected(id);
                                focusOnItem(i);
                            }
                        }}
                    >
                        <img src={thumbnail} alt={name} style={imgStyle}/>
                        <div className="char__name">{name}</div>
                    </li>
                </CSSTransition>
            );
        });

        return (            
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {content}
                </TransitionGroup>
            </ul>            
        )
    }    
        
    const items = renderItems(charsData);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>       
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;