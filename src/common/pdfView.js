import moment from "moment";
import { getAddedAmountArray } from "./utils/arrayObjectUtils";

export const htmltable = (sourceItem) => {
    const addedAmountValue = getAddedAmountArray(sourceItem);

    // Each expense showing table

    let r =
        `<tr>
            <th><strong>Name</strong></th>
            <th><strong>Expense</strong></th>
            <th><strong>Paid</strong></th>
        </tr>`;

    for (let i in sourceItem) {
        const sourceItemDataList = sourceItem[i].data.filter(obj => obj.type != '');

        // Date Format
        var date = new Date(sourceItem[i].creationDate);
        const dateTime = moment(date).format("MMMM Do YYYY, h:mm:ss A");

        if (sourceItem[i].foodType) {
            r = r +
                `<tr>
                    <td colspan="2">${dateTime}</td>
                    <td style="font-style: italic">For ${sourceItem[i].foodType}</td>
                </tr>`;
        }


        for (let j in sourceItemDataList) {
            const sourceItemData = sourceItemDataList[j];
            r = r +
                `<tr>
                    <td style="text-align:center">${sourceItemData.name}</td>
                    <td style="text-align:center">${sourceItemData.expense}</td>
                    <td style="text-align:center">${sourceItemData.paid}</td>
                </tr>`
        }
    }

    // Total Showing Table
    let t =
        `<tr>
            <th><strong>Name</strong></th>
            <th><strong>Total Paid</strong></th>
            <th><strong>Total</strong></th>
        </tr>`;
    for (let i in addedAmountValue) {
        const itemData = addedAmountValue[i];
        let balance = itemData.totalAmount;

        t = t +
            `</tr>
                <td>${itemData.name}</td>
                <td>${itemData.paid}</td>
                <td bgcolor=${Math.sign(balance) == 1 ? "green" : "#FF3838"}; style="font-weight:bold";>${Math.sign(balance) == 1 ? 'Need' : 'Give Back'} ${Math.abs(balance.toFixed())} rs</td>
            </tr>`
    }

    return `<html><header>Generated Bill By Trip Checklist</header><title></title>
        <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 99%;
            margin: 10px;
        }
          
        td, th {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: center;
        }
        div {
            opacity: 0.1;
            color: BLACK;
            position: fixed;
            top: auto;
            left: 23%;
        }
        </style>
        <body>
        <center>
            <img src="file:///android_asset/images/side_logo.jpg" alt="App logo" style="width:100px">
        </center>
        <table>${r}</table>
        <div class="watermark">
            <center>
                <img src="file:///android_asset/images/side_logo.jpg" alt="App logo" style="width:400px">
            </center>
        </div>
        <center><h3>Total Splitwise</h3></center>
        <table>${t}</table>
        </body>
    </html>`
}

// let r =
//     `<tr>
//         <th><strong>Name</strong></th>
//         <th><strong>Expense</strong></th>
//         <th><strong>Paid</strong></th>
//         <th><strong>type</strong></th>
//     </tr>`;

// for (let i in sourceItem) {
//     const sourceItemDataList = sourceItem[i].data.filter(obj => obj.type != '');
//     for (let j in sourceItemDataList) {
//         const sourceItemData = sourceItemDataList[j];
//         r = r +
//             `</tr>
//                 <td>${sourceItemData.name}</td>
//                 <td>${sourceItemData.expense}</td>
//                 <td>${sourceItemData.paid}</td>
//                 <td>${sourceItemData.type}</td>
//             </tr>`
//     }
// }

