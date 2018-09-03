import * as React from 'react';
import * as logoSrc from '../../assets/img/SeaBadgerWhiteLogo.png';
import * as classes from './Logo.css';

const logo: React.StatelessComponent<{}> = () => {
  return (
    <div className={classes.Logo}>
      <img src={logoSrc} alt="Logo" />
    </div>
  );
};

export default logo;
