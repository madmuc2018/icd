import React from 'react';
import { IoMdRefreshCircle } from 'react-icons/io';
import { Button } from 'react-bootstrap';

export default () => <Button className="cdFore" variant="light" onClick={() => window.location.reload()}>Refresh <IoMdRefreshCircle/> </Button>;
