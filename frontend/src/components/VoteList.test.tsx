import Axios from "axios";
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import { VoteList } from './VoteList';

describe("Vote List", () => {
    describe("data fetching", () => {
        it("displays vote summaries from the backend", async (done) => {
            const response = [
                {
                    name: "test0",
                    hashid: "abcde"
                },
                {
                    name: "test1",
                    hashid: "fghi"
                }
            ];
            const axiosStub = sinon.stub(Axios, "get");
            axiosStub.withArgs("/api/v0.1/votes").resolves({
                data: response
            });

            const voteList = mount(<VoteList />);
            setImmediate(() => {
                expect(voteList.text()).toMatch(/test0/);
                expect(voteList.text()).toMatch(/test1/);
                done();
            });
        });
    });
});
