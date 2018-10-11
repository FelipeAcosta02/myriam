import React, { Component } from 'react';
import logo from './logo.svg';

export default class App extends Component {
  state = { chemicalExpression: '', elementsComputed: [] };
  calculateValues = (e) => {
    e.preventDefault();
    let exp = this.state.chemicalExpression;
    if (exp) {
      let elementsComputed = {};
      const getIndex = (el) => el.match(/\d+$/) ? Number(el.match(/\d+$/)) : 1;
      const getElem = (el) => el.match(/[A-Z][a-z]|[A-Z]/g).pop();
      const getElemsWithIndex = (el) => el.match(/[A-Z][a-z]\d+(?!\.)|[A-Z]\d+(?!\.)|[A-Z][a-z]|[A-Z]/g);
      const getBetweenParenthsis = (el) => el.match(/\(([^)]+)\)\d+(?!\.)|\(([^)]+)\)/gi);
      const moleculeBlocks = getBetweenParenthsis(exp) ? getBetweenParenthsis(exp) : [];
      moleculeBlocks.forEach(mol => {
        exp = exp.replace(mol, '');
        getElemsWithIndex(mol).forEach(el => exp = exp + getElem(el) + getIndex(mol) * getIndex(el));
      });
      const elementsUsed = getElemsWithIndex(exp);
      elementsUsed.forEach(el => elementsComputed[getElem(el)] = elementsComputed[getElem(el)] ?
        elementsComputed[getElem(el)] + getIndex(el) : getIndex(el));
      elementsComputed = Object.entries(elementsComputed).map(([key, value]) => (
        {
          key,
          atoms: value,
          MM: this.relativeAtomicMassOf[key] * value,
          grams: this.relativeAtomicMassOf[key] * value * this.avogadro,
          atomicMass: this.relativeAtomicMassOf[key]
        }
      ));
      this.setState({ elementsComputed });
    } else {
      alert('Your Chemical Expression Cannot Be Empty');
    }
  };
  sumAllValues = (att) => {
    const elems = this.state.elementsComputed
    let value = 0;
    elems.forEach(el => value = value + el[att]);
    return (value);
  };
  avogadro = 602200000000000000000000;
  relativeAtomicMassOf = {
    H: 1.0079,
    He: 4.0026,
    Li: 6.941,
    Be: 9.0122,
    B: 10.811,
    C: 12.0107,
    N: 14.0067,
    O: 15.9994,
    F: 18.9984,
    Ne: 20.1797,
    Na: 22.9897,
    Mg: 24.305,
    Al: 26.9815,
    Si: 28.0855,
    P: 30.9738,
    S: 32.065,
    Cl: 35.453,
    K: 39.0983,
    Ar: 39.948,
    Ca: 40.078,
    Sc: 44.9559,
    Ti: 47.867,
    V: 50.9415,
    Cr: 51.9961,
    Mn: 54.938,
    Fe: 55.845,
    Ni: 58.6934,
    Co: 58.9332,
    Cu: 63.546,
    Zn: 65.39,
    Ga: 69.723,
    Ge: 72.64,
    As: 74.9216,
    Se: 78.96,
    Br: 79.904,
    Kr: 83.8,
    Rb: 85.4678,
    Sr: 87.62,
    Y: 88.9059,
    Zr: 91.224,
    Nb: 92.9064,
    Mo: 95.94,
    Tc: 98,
    Ru: 101.07,
    Rh: 102.9055,
    Pd: 106.42,
    Ag: 107.8682,
    Cd: 112.411,
    In: 114.818,
    Sn: 118.71,
    Sb: 121.76,
    I: 126.9045,
    Te: 127.6,
    Xe: 131.293,
    Cs: 132.9055,
    Ba: 137.327,
    La: 138.9055,
    Ce: 140.116,
    Pr: 140.9077,
    Nd: 144.24,
    Pm: 145,
    Sm: 150.36,
    Eu: 151.964,
    Gd: 157.25,
    Tb: 158.9253,
    Dy: 162.5,
    Ho: 164.9303,
    Er: 167.259,
    Tm: 168.9342,
    Yb: 173.04,
    Lu: 174.967,
    Hf: 178.49,
    Ta: 180.9479,
    W: 183.84,
    Re: 186.207,
    Os: 190.23,
    Ir: 192.217,
    Pt: 195.078,
    Au: 196.9665,
    Hg: 200.59,
    Tl: 204.3833,
    Pb: 207.2,
    Bi: 208.9804,
    Po: 209,
    At: 210,
    Rn: 222,
    Fr: 223,
    Ra: 226,
    Ac: 227,
    Pa: 231.0359,
    Th: 232.0381,
    Np: 237,
    U: 238.0289,
    Am: 243,
    Pu: 244,
    Cm: 247,
    Bk: 247,
    Cf: 251,
    Es: 252,
    Fm: 257,
    Md: 258,
    No: 259,
    Rf: 261,
    Lr: 262,
    Db: 262,
    Bh: 264,
    Sg: 266,
    Mt: 268,
    Rg: 272,
    Hs: 277
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" height='80px' width='80px' />
          <h1>Put your Chemical Expression Below</h1>
          <form action="Get Chmical Expression">
            <input
              placeholder='Tc(HPO3)2'
              type="text" value={this.state.chemicalExpression}
              onChange={e => this.setState({ chemicalExpression: e.target.value })}
            />
            <input type='submit' onClick={this.calculateValues} value='Compute Chemical Compound!' />
          </form>
          {
            this.state.elementsComputed.length ?
              <table style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Atoms</th>
                    <th>MM</th>
                    <th>Total Grams</th>
                    <th>Rel. Atomic Mass</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.elementsComputed.map(({ key, atoms, MM, grams, atomicMass }, i) =>
                      <tr key={i}>
                        <td>{key}</td>
                        <td>{atoms}</td>
                        <td>{MM}</td>
                        <td>{grams}</td>
                        <td>{atomicMass}</td>
                      </tr>
                    )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>TOTAL</th>
                    <td>{this.sumAllValues('atoms')}</td>
                    <td>{this.sumAllValues('MM')}</td>
                    <td>{this.sumAllValues('grams')}</td>
                    <td>{this.sumAllValues('atomicMass')}</td>
                  </tr>
                </tfoot>
              </table>
              :
              <div />
          }
        </header>
      </div>
    );
  };
};