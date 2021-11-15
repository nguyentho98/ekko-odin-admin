// ** Navigation sections imports
import apps from './apps'
import pages from './pages'
import forms from './forms'
import tables from './tables'
import others from './others'
import dashboards from './dashboards'
import dashboardCenter from './dashboardCenter'
import uiElements from './ui-elements'
import chartsAndMaps from './charts-maps'

// ** Merge & Export
export default [...dashboardCenter, ...dashboards, ...apps, ...pages, ...uiElements, ...forms, ...tables, ...chartsAndMaps, ...others]