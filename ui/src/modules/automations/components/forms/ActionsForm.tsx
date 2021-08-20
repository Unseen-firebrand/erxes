import { __ } from 'modules/common/utils';
import React from 'react';
import {
  ActionBox,
  TriggerTabs,
  ScrolledContent
} from 'modules/automations/styles';
import Icon from 'modules/common/components/Icon';
import { ACTIONS } from 'modules/automations/constants';
import { IAction } from 'modules/automations/types';
import { TabTitle, Tabs } from 'modules/common/components/tabs';
import Tip from 'modules/common/components/Tip';

type Props = {
  onClickAction: (action: IAction) => void;
};

type State = {
  currentTab: string;
  isFavourite: boolean;
};

class ActionsForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'actions',
      isFavourite: false
    };
  }

  tabOnClick = (currentTab: string) => {
    this.setState({ currentTab });
  };

  onFavourite = action => {
    const actionsLocalStorage =
      localStorage.getItem('automations_favourite_actions') || '[]';

    let actions = JSON.parse(actionsLocalStorage);

    if (actions.find(item => item.type === action.type)) {
      actions = actions.filter(item => item.type !== action.type);
    } else {
      actions.push(action);
    }

    localStorage.setItem(
      'automations_favourite_actions',
      JSON.stringify(actions)
    );
  };

  renderBox(action, isFavourite, index) {
    const { onClickAction } = this.props;

    return (
      <ActionBox
        key={index}
        onClick={onClickAction.bind(this, action)}
        isFavourite={isFavourite}
        isAvailable={action.isAvailable}
      >
        <Icon icon={action.icon} size={30} />
        <div>
          <b>{__(action.label)}</b>
          {!action.isAvailable && <span>Coming soon</span>}
          <p>{__(action.description)}</p>
        </div>
        <Tip text="Favourite" placement="top">
          <div
            className="favourite-action"
            onClick={() => this.onFavourite(action)}
          >
            <Icon icon="star" size={20} />
          </div>
        </Tip>
      </ActionBox>
    );
  }

  renderContent() {
    const localStorageActions = JSON.parse(
      localStorage.getItem('automations_favourite_actions') || '[]'
    );

    const actions =
      this.state.currentTab === 'favourite' ? localStorageActions : ACTIONS;

    return actions.map((action, index) => {
      const isFavourite = localStorageActions.some(
        item => item.type === action.type
      );

      return (
        <React.Fragment key={index}>
          {this.renderBox(action, isFavourite, index)}
        </React.Fragment>
      );
    });
  }

  render() {
    const { currentTab } = this.state;

    return (
      <>
        <TriggerTabs>
          <Tabs full={true}>
            <TabTitle
              className={currentTab === 'actions' ? 'active' : ''}
              onClick={this.tabOnClick.bind(this, 'actions')}
            >
              {__('Available actions')}
            </TabTitle>
            <TabTitle
              className={currentTab === 'favourite' ? 'active' : ''}
              onClick={this.tabOnClick.bind(this, 'favourite')}
            >
              {__('Favourite')}
            </TabTitle>
          </Tabs>
        </TriggerTabs>
        <ScrolledContent>{this.renderContent()}</ScrolledContent>
      </>
    );
  }
}

export default ActionsForm;
