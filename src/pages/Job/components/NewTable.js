import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { filter, get } from 'lodash'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { lighten, makeStyles } from '@material-ui/core/styles';

import { useRecoilState, useRecoilValue } from 'recoil'
import { currentUserAtom } from '../../../recoil/atoms'

import { CSVLink, CSVDownload } from "react-csv";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip
} from "@material-ui/core";
import {
	formatDate,
	renderWithLoader,
	titleGenerator,
} from '../../../utils/helperFunctions'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';

import Search from '../../../components/Search'

function createData(code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink) {
  return { code, title, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttactmentLink};
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'jobCode', numeric: false, disablePadding: true, label: 'job code' },
  { id: 'jobTitle', numeric: false, disablePadding: true, label: 'job title' },
  { id: 'state', numeric: false, disablePadding: true, label: 'state' },
  { id: 'district', numeric: false, disablePadding: true, label: 'district' },
  { id: 'zone', numeric: false, disablePadding: true, label: 'zone' },
  { id: 'status', numeric: false, disablePadding: true, label: 'status' },
  { id: 'noOfOpening', numeric: false, disablePadding: true, label: 'no of opening' },
  { id: 'startDate', numeric: false, disablePadding: true, label: 'start date' },
  { id: 'closeDate', numeric: false, disablePadding: true, label: 'close date' },
  { id: 'industry', numeric: false, disablePadding: true, label: 'industry' },
  { id: 'company', numeric: false, disablePadding: true, label: 'company' },
  { id: 'vertical', numeric: false, disablePadding: true, label: 'vertical' },
  { id: 'division', numeric: false, disablePadding: true, label: 'division' },
  { id: 'ctcMin', numeric: false, disablePadding: true, label: 'CTC Min' },
  { id: 'ctcMax', numeric: false, disablePadding: true, label: 'CTC Max' },
  { id: 'CVShared', numeric: false, disablePadding: true, label: 'No. of cvs shared' },
  { id: 'sharedToHRDate', numeric: false, disablePadding: true, label: 'shared with hr date' },
  { id: 'JDAttachmentLink', numeric: false, disablePadding: true, label: 'jd attachment' },
];


function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
        //     padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label.toUpperCase()}</b>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
    fontWeight: 'bold'
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, jobData, setFilterData, rows } = props;
  const currentUser = useRecoilValue(currentUserAtom)
  const history = useHistory()
  const location = useLocation().pathname
  
  const onSearchChange = (e) => {
		var inputVal = e.target.value
		var filterData = jobData.filter(data => {
			return data.jobCode.toLowerCase().includes(inputVal) || 
      data.jobTitle.toLowerCase().includes(inputVal) || 
      data.state.toLowerCase().includes(inputVal) || 
      data.district.toLowerCase().includes(inputVal) || 
      data.zone.toLowerCase().includes(inputVal) || 
      data.company.toLowerCase().includes(inputVal) || 
      data.vertical.toLowerCase().includes(inputVal) || 
      data.division.toLowerCase().includes(inputVal) || 
      data.industry.toLowerCase().includes(inputVal)
		});
		setFilterData(filterData);
	}

  return (
    <>
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography style={{textAlign: 'left', flex: 'none'}} className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography style={{textAlign: 'left', flex: 'none'}} className={classes.title} variant="h6" id="tableTitle" component="div">
          Jobs
        </Typography>
      )}

      {/* search */}
      <div style={{margin: '0 auto'}}>
        <Search onChange={(e) => {onSearchChange(e)} } />
      </div>


      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon onClick={() => console.log('delete button click')} />
          </IconButton>
        </Tooltip>
      ) : (
        <>
        {get(currentUser, 'roleId.permissions.job.create') && (
							<Tooltip title="Add Job">
              <IconButton aria-label="add job" onClick={() => history.push(`${location}/add`)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
						)}
            <CSVLink data={rows} headers={headCells.label} filename={"jobs.csv"}>
              <Tooltip title="Download">
                <IconButton aria-label="download">
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            </CSVLink>
          </>
        
      )}
    </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({filterData,setFilterData, jobData, toApply}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('postedOn');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const location = useLocation().pathname
  const rows = [];

  filterData.map(job => {
    const {jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink} = job
          rows.push(
            createData(jobCode, jobTitle, state, district, zone, status, noOfOpening, startDate, closeDate, industry, company, vertical, division, ctcMin, ctcMax, CVShared, sharedToHRDate, JDAttachmentLink)
          );
  })


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.code);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, code) => {
    const selectedIndex = selected.indexOf(code);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, code);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (code) => selected.indexOf(code) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} jobData={jobData} setFilterData={setFilterData} rows={rows} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy} 
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.code);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {handleClick(event, row.code)}}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.code}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" style={{minWidth: 120}}>
                      {toApply ? (
                          row.code
                        ) : (
                          <NavLink to={`${location}/${row.code}`}>
                            {row.code}
                          </NavLink>
                        )}

                      </TableCell>
                      <TableCell style={{minWidth: 200}}>{row.title}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.state}</TableCell>
                      <TableCell style={{minWidth: 120}}>{row.district}</TableCell>
                      <TableCell>{row.zone}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.noOfOpening}</TableCell>
                      <TableCell style={{minWidth: 140}}>{formatDate(row.startDate)}</TableCell>
                      <TableCell style={{minWidth: 140}}>{formatDate(row.closeDate)}</TableCell>
                      <TableCell style={{minWidth: 120}}>{row.industry}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell style={{minWidth: 150}}>{row.vertical}</TableCell>
                      <TableCell>{row.division}</TableCell>
                      <TableCell style={{minWidth: 120}}>{row.ctcMin}</TableCell>
                      <TableCell style={{minWidth: 120}}>{row.ctcMax}</TableCell>
                      <TableCell style={{minWidth: 180}}>{row.CVShared}</TableCell>
                      <TableCell style={{minWidth: 200}}>{row.sharedToHRDate}</TableCell>
                      <TableCell style={{minWidth: 200}}><a href={row.JDAttactmentLink} target='_blank'>Link</a></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
