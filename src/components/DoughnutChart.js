import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import palette from 'google-palette/palette.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart(props) {
  
    let colorScheme = [];
    try {
      colorScheme = palette('all', props.data.data.length).map(hex => '#' + hex);
    } catch {
      console.error('Unable to generate color scheme for data length:', props.data.data.length);
    }

    const data = {
      labels: props.data.labels,
      datasets: [
        {
          data: props.data.data,
          backgroundColor: colorScheme,
          borderWidth: 1,
        },
      ],
    };
    return <Doughnut data={data} />;
};