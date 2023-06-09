import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';


class Sandwich extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name_value: null,
            sandwich_id: null,
            new_order_id: null
        };
    }

    handleCheck(e) {
        fetch('http://localhost:8080/v1/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "sandwichId": parseInt(e.currentTarget.dataset.id),
                "status": "received",
                "id": 0
            })
        })
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            this.setState({
                new_order_id: result.order_id
            });
            console.log(this.state.new_order_id);
        });
    }

    render() {
        return (
            <tr key={this.props.sandwich_id} className='sandwich'>
                <td>{ this.props.name_value }</td>
                <td>
                    <button className='order_button btn btn-primary' onClick={this.handleCheck.bind(this)} data-id={ this.props.sandwich_id }>Order</button>
                </td>
                <td>
                    <p>
                        {(this.state.new_order_id)?'New order_id: '+this.state.new_order_id:''}
                    </p>
                </td>
            </tr>
        );
    }
};

class SandwichList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sandwiches: [],
        };
    }

    componentDidMount() {
        fetch("http://localhost:8080/v1/sandwich")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        sandwiches: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, sandwiches } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let sandwich_list = sandwiches.map(function (sandwich) {
                return (
                    <Sandwich key={sandwich._id} sandwich_id={sandwich.sandwich_id} name_value={sandwich.name} 
                    />
                );
            });

            return (
                <div className="col-md-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sandwich type</th>
                                <th>Choose </th>
                                <th>Order id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sandwich_list}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
};

class SearchOrder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            order_id: '',
            order_status: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.setState({ order_id: e.target.value });
    }

    handleClick() {
        fetch("http://localhost:8080/v1/order/"+this.state.order_id)
        .then(res => res.json())
        .then(
            (result) => {
                if ( result.hasOwnProperty('order_id') ) {
                    this.setState({
                        order_status: result.status
                    });

                } else {
                    this.setState({
                        order_status: null
                    });
                }
            },
            (error) => {
                console.log(error);
                this.setState({
                    order_status: null
                });
            }
        )
    }

    render() {
        return(

            <div className="row check_order_status_div">
                <div className="input-group col-md-4 col-md-offset-4">
                    <input type="text" className="form-control" placeholder="Input order_id" onChange={ this.handleChange } />
                       <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.handleClick}>Query Order</button>
                       </span>
                </div>
                <div className="col-md-4"></div>
                <div className="col-md-12" id="show_order_status">
                    <OrderStatus order_id={this.state.order_id} order_status={this.state.order_status} />
                </div>
            </div>
        );
    }
}

class OrderStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            order_status: null,
            order_id: null
        };
    }

    render() {

        let order_status = this.props.order_status;
        if(order_status === null){
            order_status = 'not found';
        }

        return (
            <p>
                <b> order id: {this.props.order_id}   status: {order_status}</b>
            </p>
        );
    }
}

class SandwichesView extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Sandwich</h1>
                </header>

                <div className="sandwitch_order">
                    <SandwichList />
                </div>

                <SearchOrder />

            </div>
        );
    }
}

ReactDOM.render(
    <SandwichesView />,
    document.getElementById('root')
);
