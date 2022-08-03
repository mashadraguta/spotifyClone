import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node'
import SearchTrackResults from './SearchTrackResults';
import Player from './Player';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
    clientId: '4cf0aeb0813349d49a8ef44c89507541',
})

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState('')

    function chooseTrack(track) {

        setPlayingTrack(track)
        setSearch('')
        setLyrics('')
    }


    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.track,
                artist: playingTrack.artist
            }
        }).then((res) => setLyrics(res.data.lyrics))
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false
        spotifyApi.searchTracks(search).then((res) => {
            if (cancel) return
            setSearchResults(res.body.tracks.items.map(item => {
                const smallesAlbumImage = item.album.images.reduce(
                    (smallest, image) => {
                        if (image.height < smallest.height) {
                            return image
                        } else {
                            return smallest
                        }

                    }, item.album.images[0])
                return {
                    artist: item.artists[0].name,
                    track: item.name,
                    uri: item.uri,
                    albumUrl: smallesAlbumImage.url

                }
            }))
        })
        return () => cancel = true
    }, [search, accessToken])


    return (
        <Container className="d-flex flex-column py-2"
            style={{ height: '100vh' }}>
            <Form.Control type='search'
                placeholder="Search songs/artists"
                value={search}
                onChange={e => setSearch(e.target.value)} />
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
                {searchResults.map(track => (
                    <SearchTrackResults track={track}
                        key={track.uri}
                        chooseTrack={chooseTrack} />))}
                {searchResults.length === 0 && (
                    <div className='text-center'
                        style={{ whiteStape: 'pre' }}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div>
                <Player accessToken={accessToken}
                    trackUri={playingTrack?.uri} />
            </div>
        </Container>
    );
}

export default Dashboard;
