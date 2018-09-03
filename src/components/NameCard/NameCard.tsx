import * as React from 'react';
import * as anonLogoSrc from '../../assets/img/person.png';
import * as classes from './NameCard.css';

export interface INameCardProps { name: string; age: number; }

export class NameCard extends React.Component<INameCardProps, {}> {
  public render() {
    return (
      <div className={classes.NameCard}>
        <div className={classes.Details}>
          <p className={classes.Name}>Name: {this.props.name}</p>
          <p className={classes.Age}>Age: {this.props.age}</p>
        </div>
        <div className={classes.ProfilePicture}>
          <img src={anonLogoSrc} alt="Profile picture" />
        </div>
      </div>
    );
  }
}
