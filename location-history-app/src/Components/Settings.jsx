import React, { Component, useState } from 'react'
import {Dropdown, FormControl} from 'react-bootstrap'
import { countries } from '../res/countries.js'

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

class Settings extends Component {

    constructor() {
        super()
        this.state = {homeCountry: "United Kingdom"}
    }

    render() {
        return (
            <div>
                Settings

                <Dropdown>
                    <Dropdown.Toggle id="dropdown-custom-components">
                        Home Country: {this.state.homeCountry}
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu}>
                        {countries.map(c => {
                            if (this.state.homeCountry === c) {
                                return (<Dropdown.Item active onClick={() => this.setState({homeCountry: c})}>{c}</Dropdown.Item>)
                            } else {
                                return (<Dropdown.Item onClick={() => this.setState({homeCountry: c})}>{c}</Dropdown.Item>)
                            }
                        })}
                    </Dropdown.Menu>
                </Dropdown>

            </div>
        )
    }

}

export default Settings