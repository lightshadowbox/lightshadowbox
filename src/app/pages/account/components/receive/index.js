import React from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard, Tooltip } from 'react-copy-to-clipboard';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';
import { onSetReceiveAssetState } from 'app/pages/account/redux/slice';
import { makeSelectReceiveAssetStatus } from 'app/pages/account/redux/selectors';

const ReceiveAssetStyled = styled.div`
    flex: 1;
    .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
    }
    .coins {
        max-height: 25rem;
        overflow-x: hidden;
        overflow-y: auto;
        .inner {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .content {
                margin-left: 0.875rem;
                min-width: 0;
                display: flex;
                flex-direction: column;
                flex: 1;
                text-align: left;
            }
        }
    }
`;

const ReceiveAsset = () => {
    const dispatch = useDispatch();
    const accountSelected = useSelector(makeSelectAccountSelected());
    const visible = useSelector(makeSelectReceiveAssetStatus());

    const onHandleCancel = () => {
        dispatch(onSetReceiveAssetState(false));
    };

    return (
        <Modal footer={null} visible={visible} title="Receive" onCancel={onHandleCancel} className="text-center custom-modal full-buttons">
            <ReceiveAssetStyled>
                <p className="caption">
                    All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this
                    website.
                </p>
                {/* <CopyToClipboard text={accountSelected?.paymentAddressKeySerialized}>
                    <Tooltip placement="bottom" title="Copy to clipboard" arrowPointAtCenter>
                        <Button className="address">
                            <span className="ellipsis">{accountSelected?.paymentAddressKeySerialized}</span>
                            <span className="indent">{accountSelected?.paymentAddressKeySerialized}</span>
                            <CopyOutlined />
                        </Button>
                    </Tooltip>
                </CopyToClipboard> */}
            </ReceiveAssetStyled>
        </Modal>
    );
};

ReceiveAsset.propTypes = {};

export default ReceiveAsset;
