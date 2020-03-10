import React, { Component } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Chart } from '@progress/kendo-charts-react-wrapper';
import { filterBy } from "@progress/kendo-data-query";
import "@progress/kendo-ui";
import "@progress/kendo-theme-default/dist/all.css";
import "./App.css";

import nutrition from "./nutrition.json";

class App extends Component {
  constructor(props) {
    super(props);
    const initialFilter = {
      logic: "and",
      filters: [
        {
          field: "Description",
          operator: "contains",
          value: ""
        }
      ]
    };
    this.state = {
      data: this.getNutrition(initialFilter),
      filter: initialFilter,
      habitId: 0,
      habitName: "",
      habitIteration: 0,
      habits: [],
      habitsOptions: [
        "Drink 1 Cup of Water",
        "1 Hours of Coding",
        "100 Pushups",
        "Drink a smoothie every morning",
        "A few minutes of Meditation",
        "Play a Video Game to Detox and Retreat",
        "Play sand volleyball in the evening"
      ],
      series: [{ data: [1, 1, 1] }],
      seriesDefaults: {type: 'pie'},
      graphProtein: 0,
      graphCarb: 0,
      graphSugar: 0
    };
  }

  handleNameChange = e => {
    this.setState({
      habitName: e.target.value
    });
  };

  handleChemicalChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
    this.handleGraphChange();
  }

  // handleProteinChange = e => {
  //   this.setState({
  //     graphProtein: e.target.value
  //   });
  //   this.handleGraphChange();
  // };

  // handleCarbChange = e => {
  //   this.setState({
  //     graphCarb: e.target.value
  //   });
  //   this.handleGraphChange();
  // };

  // handleSugarChange = e => {
  //   this.setState({
  //     graphSugar: e.target.value
  //   });
  //   this.handleGraphChange();
  // };

  handleGraphChange = () => {
    this.setState({
      series: [{
        data: [
          this.state.graphProtein,
          this.state.graphCarb,
          this.state.graphSugar
        ]
      }]
    });
  }

  handleIterationChange = e => {
    this.setState({
      habitIteration: e.target.value
    });
  };

  handleAddHabit = e => {
    this.setState({
      habits: this.state.habits.concat([
        {
          key: this.state.habitId,
          name: this.state.habitName,
          iterations: this.state.habitIteration
        }
      ]),
      habitId: this.state.habitId + 1
    });
  };

  getNutrition = filter => filterBy(nutrition, filter);

  handleFilterChange = e => {
    this.setState({
      data: this.getNutrition(e.filter),
      filter: e.filter
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Healthy Things</h1>
        <div className="healthy-habits">
          <ul>
            {this.state.habits.map(habit => {
              return (
                <li key={habit.habitId}>
                  <h3>{habit.name}</h3>
                  <div className="iterations-area">
                    {[...Array(habit.iterations)].map((iteration, index) => {
                      return <input key={index} type="radio" />;
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="add-habits">
          <DropDownList
            data={this.state.habitsOptions}
            value={this.state.habitName}
            onChange={this.handleNameChange}
          />
          <NumericTextBox
            format="0"
            min={0}
            max={22}
            value={this.state.habitIteration}
            onChange={this.handleIterationChange}
          />
          <Button primary={true} onClick={this.handleAddHabit}>
            Add Habit
          </Button>
        </div>
        <div className="nutrition-grid">
          <Grid
            data={this.state.data}
            style={{ maxHeight: "500px" }}
            filterable={true}
            filter={this.state.filter}
            onFilterChange={this.handleFilterChange}
          >
            <Column field="Description" title="Food" />
            <Column field="Measure" title="Amount" />
            <Column field="Protien(g)Per Measure" title="Protien" />
            <Column
              field="Carbohydrate, by difference(g)Per Measure"
              title="Carbs"
            />
            <Column field="Sugars total(g)Per Measure" title="Sugar" />
          </Grid>
        </div>
        <div className="food-graph-inputs">
            <p>Protein Amount:
              <input type="text" id="graphProtein" onChange={this.handleChemicalChange} />
            </p>
            <p>Carb Amount:
              <input type="text" id="graphCarb" onChange={this.handleChemicalChange} />
            </p>
            <p>Sugar Amount:
              <input type="text" id="graphSugar" onChange={this.handleChemicalChange} />
            </p>
        </div>
        <div className="food-graph">
            <Chart seriesDefaults={this.state.seriesDefaults} series={this.state.series} />
        </div>
      </div>
    );
  }
}

export default App;
