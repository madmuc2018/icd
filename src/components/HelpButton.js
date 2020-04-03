import React from 'react';
import { IoIosHelpCircle } from 'react-icons/io';
import { Button } from 'react-bootstrap';

export default () =>
  <div className="text-center">
    <Button
      className="cdFore"
      variant="light"
      href={`${process.env.PUBLIC_URL}/help.png`}
      target="_blank"
    >
				Help <IoIosHelpCircle/>
    </Button>
  </div>;