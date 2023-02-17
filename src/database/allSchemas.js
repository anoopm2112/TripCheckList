import realm from 'realm';
export const TRIP_CHECKLIST_SCHEMA = "TripCheckList";
export const CHECKLIST_SCHEMA = "CheckList";
export const TRIP_SPLITWISE_SCHEMA = "TripSplitWise";
export const SPLITWISE_SCHEMA = "SplitWise";
export const MEMBERS = "Members";
export const SPLITWISEMETA = "SplitWiseMeta";
export const NOTES = "Notes";

export const CheckListSchema = {
    name: CHECKLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        item: 'string',
        counter: 'int',
        image: 'string',
        checked: 'bool'
    }
}

export const TripCheckListSchema = {
    name: TRIP_CHECKLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        creationDate: 'date',
        title: 'string',
        isCompleted: 'bool',
        ReminderTime: 'date',
        checkListItems: { type: 'list', objectType: CHECKLIST_SCHEMA }
    }
}

// SplitWise Scheema
export const SplitWiseSchema = {
    name: SPLITWISE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        type: 'string',
        expense: 'int',
        paid: 'int',
        name: 'string'
    }
}

const MembersSchema = {
    name: MEMBERS,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        expense: 'int',
        paid: 'int',
        type: 'string',
    }
};

const NotesSchema = {
    name: NOTES,
    primaryKey: 'id',
    properties: {
        id: 'string',
        note: 'string',
        creationDate: 'date'
    }
}

const SplitWiseMetaSchema = {
    name: SPLITWISEMETA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        foodType: 'string',
        creationDate: 'date',
        data: { type: 'list', objectType: SPLITWISE_SCHEMA }
    }
};

export const TripSplitWiseSchema = {
    name: TRIP_SPLITWISE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        creationDate: 'date',
        totalAmount: 'int',
        members: { type: 'list', objectType: MEMBERS },
        splitWiseListItems: { type: 'list', objectType: SPLITWISEMETA },
        notes: { type: 'list', objectType: NOTES }
    }
}

const databaseOptions = {
    path: 'tripCheckListApp.realm',
    schema: [
        CheckListSchema, TripCheckListSchema,
        SplitWiseSchema, TripSplitWiseSchema, MembersSchema, NotesSchema,
        SplitWiseMetaSchema
    ],
    schemaVersion: 1
}

// Insert List
export const insertNewChecList = newTripCheckList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(TRIP_CHECKLIST_SCHEMA, newTripCheckList);
            resolve(newTripCheckList);
        });
    }).catch((error) => reject(error));
});

// Update List
export const updateCheckList = tripCheckList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let updatingCheckList = realm.objectForPrimaryKey(TRIP_CHECKLIST_SCHEMA, tripCheckList.id);
            updatingCheckList.title = tripCheckList.title;
            updatingCheckList.checkListItems = tripCheckList.checkListItems;
            updatingCheckList.isCompleted = tripCheckList.isCompleted;
            resolve(updatingCheckList);
        });
    }).catch((error) => reject(error));
});

// Delete List
export const deleteCheckList = tripCheckListId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingCheckList = realm.objectForPrimaryKey(TRIP_CHECKLIST_SCHEMA, tripCheckListId);
            realm.delete(deletingCheckList);
            resolve();
        });
    }).catch((error) => reject(error));
});

// Delete All List
export const deleteAllCheckList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingAllCheckList = realm.objects(TRIP_CHECKLIST_SCHEMA);
            realm.delete(deletingAllCheckList);
            resolve();
        });
    }).catch((error) => reject(error));
});

// Query All List
export const queryAllCheckList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allCheckList = realm.objects(TRIP_CHECKLIST_SCHEMA);
        const isCompletedFalse = allCheckList.filtered("isCompleted == false");
        resolve(isCompletedFalse);
    }).catch((error) => reject(error));
});

// Query History Completed List
export const queryHistoryCompletedCheckList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allCheckList = realm.objects(TRIP_CHECKLIST_SCHEMA);
        const isCompletedTrue = allCheckList.filtered("isCompleted == true");
        resolve(isCompletedTrue);
    }).catch((error) => reject(error));
});

// Insert SplitWise
// Insert List
export const insertNewSplitWise = newTripSplitWiseList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(TRIP_SPLITWISE_SCHEMA, newTripSplitWiseList);
            resolve(newTripSplitWiseList);
        });
    }).catch((error) => reject(error));
});

// Query All splitWise list
export const queryAllSplitWiseList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allSplitWiseList = realm.objects(TRIP_SPLITWISE_SCHEMA);
        resolve(allSplitWiseList);
    }).catch((error) => reject(error));
});

// Update splitWise List
export const updateSplitWiseList = tripCheckList => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let updatingCheckList = realm.objectForPrimaryKey(TRIP_SPLITWISE_SCHEMA, tripCheckList.id);
            updatingCheckList.totalAmount = tripCheckList.totalAmount;
            updatingCheckList.splitWiseListItems = tripCheckList.splitWiseListItems;
            updatingCheckList.notes = tripCheckList.notes
            resolve(updatingCheckList);
        });
    }).catch((error) => reject(error));
});

// Delete All List
export const deleteAllSplitWiseList = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingAllSplitWiseList = realm.objects(TRIP_SPLITWISE_SCHEMA);
            realm.delete(deletingAllSplitWiseList);
            resolve();
        });
    }).catch((error) => reject(error));
});

// Delete SplitWise
export const deleteSplitWiseList = tripSplitWiseListId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingSplitWiseList = realm.objectForPrimaryKey(TRIP_SPLITWISE_SCHEMA, tripSplitWiseListId);
            realm.delete(deletingSplitWiseList);
            resolve();
        });
    }).catch((error) => reject(error));
});

// Delete Note
export const deleteNoteList = noteId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingNote = realm.objectForPrimaryKey(NOTES, noteId);
            realm.delete(deletingNote);
            resolve();
        });
    }).catch((error) => reject(error));
});

// Query Note List
export const queryGetNoteList = tripSplitWiseListId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const getParticularSplitWiseList = realm.objectForPrimaryKey(TRIP_SPLITWISE_SCHEMA, tripSplitWiseListId);
        resolve(getParticularSplitWiseList?.notes);
    }).catch((error) => reject(error));
});

export default new Realm(databaseOptions);

