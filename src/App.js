import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const booleanFilters = [
  {
    id: 'photoAvailable',
    name: 'Photos Available'
  },
    {
    id: 'negotiable',
    name: 'Negotiable',
  },
];


const sortList = [
{
  id: 'rent_asc',
  name: 'Rent Asc',
},
{
  id: 'rent_dsc',
  name: 'Rent Dsc',
},
{
  id: 'size_asc',
  name: 'Property Size Asc',
},
{
  id: 'size_dsc',
  name: 'Property Size Dsc',
},
{
  id: 'creation_asc',
  name: 'Creation Date Asc',
},
{
  id: 'creation_dsc',
  name: 'Creation Date Dsc',
},
];
class App extends Component {
  constructor(props){
    super(props);
    const filerState = {};
    booleanFilters.forEach((filterKey) => {
      filerState[filterKey.id] = false;
    })
    this.state = {
      ...filerState,
      allList: [],
      verticalView: true,
      sortType: 'rent_asc',
    };
  }
  componentDidMount = () => {
    fetch('http://demo8213882.mockable.io/fetchProperties')
    .then((res) => res.json())
    .then((res) => {
      this.setState({ allList: res.data })
    })
  }

  renderList = () => {
    const listsToRender = this.state.allList
    .filter(({photoAvailable}) => this.state.photoAvailable ? photoAvailable : true)
    .filter(({negotiable}) => this.state.negotiable ? negotiable : true)
    .sort(this.sortProperties)
    .map((properties) => {
      console.log('properties', properties);
      return properties
    })
    .map(({ propertyTitle, id, secondaryTitle, photos }) => {
      const imageUrl = photos[0] && photos[0].imagesMap.medium
      ? `https://images.nobroker.in/images/${id}/${photos[0] && photos[0].imagesMap.medium}`
      : 'https://images.nobroker.in/static/img/resale/1bhk.jpg'
      return(
      <div key={id} className="property-card">
        <img src={imageUrl} alt={propertyTitle} />
        <h3>{propertyTitle}</h3>
        <h6>{secondaryTitle}</h6>
      </div>
    )});
    return listsToRender;
  }

  renderBooleanFilters = () => {
    const booleanFiltersToRender = booleanFilters.map((filterKey) => {
      const {id, name} = filterKey;
      return (<div key={id} className={'sortRadioGroup'}>
            <input
            type="checkbox"
            name={id}
            id={id}
            checked={this.state[id]}
            onChange={this.handleBooleanFilterChange} />
            <label htmlFor={id}>{name}</label>
          </div>)
    });
    return booleanFiltersToRender;
  }


handleBooleanFilterChange  = (event) => {
  const {name} = event.target;
  this.setState((state) => {
    const newState = {...state};
    newState[name] = !state[name];
    return newState;
  })
}

handleSortChange  = (event) => {
  const {id} = event.target;
  this.setState({ sortType: id });
}

sortProperties = (first, second) => {
  switch (this.state.sortType) {
    case 'rent_dsc':
      return second.rent - first.rent;
      case 'size_dsc':
  return second.propertySize - first.propertySize;
      case 'size_asc':
  return first.propertySize - second.propertySize;
        case 'creation_dsc':
  return second.creationDate - first.creationDate;
      case 'creation_asc':
  return first.creationDate - second.creationDate;
    default:
      return first.rent - second.rent;
  }
}

renderSortList = () => {
      const sortListView = sortList.map((sortKey) => {
      return (
        <div key={sortKey.id} className={'sortRadioGroup'}>
            <input
            type="radio"
            name="sort"
            value={sortKey.id}
            id={sortKey.id}
            checked={sortKey.id === this.state.sortType}
            onChange={this.handleSortChange} />
            <label htmlFor={sortKey.id}>{sortKey.name}</label>
          </div>
      )
    });
    return sortListView;
}
 toggleView  = () => {
  this.setState((state) => {
    const newState = {...state};
    newState.verticalView = !state.verticalView;
    return newState;
  })
}

resetFilter = () => {
    const filerState = {};
    booleanFilters.forEach((filterKey) => {
      filerState[filterKey.id] = false;
    })
      this.setState((state) => {
    const newState = {...state, ...filerState};
    return newState;
  })
}

handleSliderChange =  (event) => {
  console.log('Event', event.target.value)

}
  render() {
    const { allList } = this.state;
    console.log('allList: ', this.state);
    return (
      <div className="App">
        <div className="top-section">
          <div className="switch-view">
            <input
            type="checkbox"
            name={'switchView'}
            id={'switchView'}
            checked={this.state.verticalView}
            onChange={this.toggleView} />
            <label htmlFor={'switchView'}>{'Toggle View'}</label>
          </div>
          <div>
            <h4>Filters</h4>
            {this.renderBooleanFilters()}
            {/* <div className="switch-view">
            <input
              type="range"
              name={'rentSlider'}
              id={'rentSlider'}
              // value={this.state.rentSlider}
              onChange={this.handleSliderChange} />
              <label htmlFor={'switchView'}>{'Rent Slider'}</label>
          </div> */}
            <button onClick={this.resetFilter}> Reset Filters </button>
            <h4>Sort</h4>
            {this.renderSortList()}
          </div>
        </div>
          <h1>Property Lists </h1>
        <div className={this.state.verticalView ? 'card-vertical' : 'card-horizontal'}>
          {this.renderList()}
        </div>
      </div>
    );
  }
}

export default App;
