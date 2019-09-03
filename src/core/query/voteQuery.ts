export interface VoteQuery {

    title:string;
    address:string;
    initiator:string;
    content:string;
    id:string;
    type:number;
    timestamp:number;
    endtime:number;
    starttime:number;
    gtmCreate:Date;
    gtmModified:Date;
    voteDataDOList:VoteDataQuery[];
}
export interface VoteDataQuery {
    id:string;
    voteid:string;
    description:string;
    gtmCreate:Date;
    gtmModified:Date;
}
