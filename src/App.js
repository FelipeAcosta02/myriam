import React, { Component } from 'react';
import logo from './logo.svg';

export default class App extends Component {
  state = { chemicalExpression: '', computedElements: [], units: '', grams: 0, mols: 0, molecules: 0 };
  getBetweenParenthsis = (el) => el.match(/\(([^)]+)\)\d+(?!\.)|\(([^)]+)\)/gi);
  getIndex = (el) => el.match(/\d+$/) ? Number(el.match(/\d+$/)) : 1;
  getElem = (el) => el.match(/[A-Z][a-z]|[A-Z]/g).pop();
  getElemsWithIndex = (el) => el.match(/[A-Z][a-z]\d+(?!\.)|[A-Z]\d+(?!\.)|[A-Z][a-z]|[A-Z]/g);
  calculateValues = (e) => {
    e.preventDefault();
    const { chemicalExpression: exp, units } = this.state;
    if (exp && units.match(/[a-z]/g).length) {
      let computedElements = this.computeExpression(exp);
      this.setState({ computedElements });
      let { grams, molecules, mols } = this.deriveUnits(units, computedElements);
      this.setState({ grams, molecules, mols });
      computedElements = this.addAtomicValues(molecules, mols, computedElements);
      this.setState({ computedElements });
    } else {
      alert('Your Chemical Expression and Units Cannot Be Empty');
    }
  };
  addAtomicValues = (molecules, mols, elems) => {
    let computedElements = elems.map(({ units, MM, ...rest }) => ({
      units,
      atoms: units * molecules,
      mols: units * mols,
      grams: units * mols * MM,
      MM,
      ...rest
    }));
    return computedElements;
  };
  computeExpression = (exp) => {
    let computedElements = {};
    const moleculeBlocks = this.getBetweenParenthsis(exp) ? this.getBetweenParenthsis(exp) : [];
    moleculeBlocks.forEach(mol => {
      exp = exp.replace(mol, '');
      this.getElemsWithIndex(mol).forEach(el => exp = exp + this.getElem(el) + this.getIndex(mol) * this.getIndex(el));
    });
    const elementsUsed = this.getElemsWithIndex(exp);
    elementsUsed.forEach(el => computedElements[this.getElem(el)] = computedElements[this.getElem(el)] ?
      computedElements[this.getElem(el)] + this.getIndex(el) : this.getIndex(el));
    computedElements = Object.entries(computedElements).map(([key, value]) => ({
      element: key,
      units: value,
      MM: this.relativeAtomicMassOf[key] * value,
      atomicMass: this.relativeAtomicMassOf[key]
    }));
    return computedElements;
  };
  deriveUnits = (units, computedElements) => {
    let unit = units[units.length - 1];
    let value = units.slice(0, units.length - 1)
    let grams, mols, molecules;
    if (unit === 'm') {
      mols = value;
      grams = value * this.sumAllValues('MM', computedElements);
    } else if (unit === 'g') {
      grams = value;
      mols = value / this.sumAllValues('MM', computedElements);
    };
    molecules = mols * this.avogadro;
    return { grams, mols, molecules };
  };
  sumAllValues = (att, computedElements) => {
    const elems = computedElements ? computedElements : this.state.computedElements;
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
          <form action="Get Chemical Expression">
            <span>Expression:</span>
            <input
              placeholder='Tc(HPO3)2'
              type="text" value={this.state.chemicalExpression}
              onChange={e => this.setState({ chemicalExpression: e.target.value })}
            />
            <span>Units:</span>
            <input
              placeholder='2.5m OR 3.2g'
              type="text" value={this.state.units}
              onChange={e => this.setState({ units: e.target.value })}
            />
            <input type='submit' onClick={this.calculateValues} value='Compute Chemical Compound!' />
          </form>
          {
            this.state.computedElements.length ?
              <table style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Units</th>
                    <th>MM</th>
                    <th>Atoms</th>
                    <th>Rel. Atomic Mass</th>
                    <th>Grams</th>
                    <th>Mols</th>
                    <th>Molecules</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.computedElements.map(
                      ({ element, units, atoms, MM, atomicMass, mols, grams }, i) =>
                        <tr key={i}>
                          <td>{element}</td>
                          <td>{units}</td>
                          <td>{MM.toFixed(4)}</td>
                          <td>{atoms.toFixed(4)}</td>
                          <td>{atomicMass.toFixed(4)}</td>
                          <td>{grams.toFixed(4)}</td>
                          <td>{mols.toFixed(4)}</td>
                          <td>-</td>
                        </tr>
                    )
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>TOTAL</th>
                    <td>{this.sumAllValues('units')}</td>
                    <td>{this.sumAllValues('MM').toFixed(4)}</td>
                    <td>{this.sumAllValues('atoms').toFixed(4)}</td>
                    <td>-</td>
                    <td>{this.state.grams.toFixed(4)}</td>
                    <td>{Number(this.state.mols).toFixed(4)}</td>
                    <td>{this.state.molecules.toFixed(4)}</td>
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