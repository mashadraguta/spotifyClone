import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'


const Player = ({ accessToken, trackUri }) => {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null
    return (
        <div>
            <SpotifyPlayer
                callback={(state) => {
                    if (!state.isPlaying) setPlay(false)
                }}
                token={accessToken}
                showSaveIcon
                play={play}
                uris={trackUri ? [trackUri] : []}
            />
        </div>
    );
}

export default Player;
