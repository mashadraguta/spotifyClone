import React from 'react';

const SearchTrackResults = ({ track, chooseTrack }) => {
    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div className='d-flex  m-2 align-items-center'
            style={{ cursor: 'pointer' }}
            onClick={handlePlay}>
            <img src={track.albumUrl} style={{ height: '65px', width: '65px' }}></img>
            <div className='d-flex mx-5 flex-column align-items-left'>
                <div >{track.track}</div>
                <div className='text-muted'>{track.artist}</div>
            </div>
        </div>
    );
}

export default SearchTrackResults;
