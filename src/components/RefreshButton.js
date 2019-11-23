import React from 'react';
import { IoMdRefreshCircle } from 'react-icons/io';
import { Button } from 'react-bootstrap';

export default () => <Button style={{'backgroundColor': '#2699FB'}} onClick={() => window.location.reload()}>Refresh <IoMdRefreshCircle/> </Button>;
