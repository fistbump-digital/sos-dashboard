import React from 'react'
import styled from 'styled-components'
import {InputBase} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

function Search({onChange}) {
        return (
                <SearchDiv>
                        <>
                                <SearchIcon />
                        </>
                        <InputBase 
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }} 
                                onChange={onChange}
                        />
                </SearchDiv>
        )
}

export default Search

const SearchDiv = styled.div`
        padding: 4px 10px;
        display: flex;
        align-items: center;
        color: #ABABAB;
        background-color: #EEF0F7;
        border-radius: 4px;
`;
